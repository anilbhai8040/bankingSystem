const bcrypt = require('bcrypt');
const User = require('../models/User');
const Account = require('../models/Account');
const VirtualCard = require('../models/VirtualCard');
const Transaction = require('../models/Transaction');
const { accountRequests } = require('./onboardingController');
const { openingPayments } = require('./adminRequestsController');

// Generate unique 10-digit account number
const generateAccountNumber = async () => {
  let accNo;
  let exists = true;
  while (exists) {
    accNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const found = await Account.findOne({ accountNumber: accNo });
    if (!found) exists = false;
  }
  return accNo;
};

/**
 * Webhook Endpoint simulating QR Payment Success.
 * Operates inside an Atomic Transaction wrapper with ROLLBACK error handling.
 */
exports.handlePaymentWebhook = async (req, res) => {
  const { qr_reference_code } = req.body;

  if (!qr_reference_code) {
    return res.status(400).json({ message: 'qr_reference_code is required in webhook payload.' });
  }

  // Transaction state snapshot for atomic rollback
  let paymentSnapshot = null;
  let requestSnapshot = null;
  let createdUser = null;
  let createdAccount = null;

  try {
    console.log(`[TRANSACTION START] Processing Payment Webhook for QR: ${qr_reference_code}`);

    // Step 1: Locate Opening_Payment record
    const paymentIndex = openingPayments.findIndex((p) => p.qr_reference_code === qr_reference_code);
    if (paymentIndex === -1) {
      throw new Error(`Invalid QR payment reference code '${qr_reference_code}'.`);
    }

    const payment = openingPayments[paymentIndex];
    if (payment.status === 'SUCCESS') {
      return res.status(200).json({ message: 'Payment webhook already processed previously.', payment });
    }

    paymentSnapshot = { ...payment };

    // Step 2: Locate linked Account_Request
    const requestIndex = accountRequests.findIndex((r) => r.request_id === payment.request_id);
    if (requestIndex === -1) {
      throw new Error(`Account request ID ${payment.request_id} not found.`);
    }

    const accountReq = accountRequests[requestIndex];
    requestSnapshot = { ...accountReq };

    // Step 3: Update Opening_Payments status to SUCCESS
    payment.status = 'SUCCESS';

    // Step 4: Update Account_Requests status to COMPLETED
    accountReq.status = 'COMPLETED';

    // Step 5: Create a new User record for the customer
    const username = `${accountReq.first_name.toLowerCase()}_${accountReq.request_id}`;
    const defaultPassword = 'Customer123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    let existingUser = await User.findOne({ username });
    if (!existingUser) {
      createdUser = await User.create({
        username,
        email: accountReq.email,
        password: hashedPassword,
        role: 'user', // Assigned 'Retail_Customer' / 'user'
      });
    } else {
      createdUser = existingUser;
    }

    // Step 6: Assign 'Retail_Customer' Role in RBAC system
    console.log(`[RBAC ROLE ASSIGNED] User '${username}' -> Role: 'Retail_Customer'`);

    // Step 7: Create final Account record with generated 10-digit account number
    const accountNumber = await generateAccountNumber();
    const openingBalance = Number(payment.amount) || 500;

    createdAccount = await Account.create({
      accountNumber,
      user: createdUser._id,
      fname: accountReq.first_name,
      father: 'Parent',
      surname: accountReq.last_name,
      dob: '1995-01-01',
      mobile: accountReq.contact,
      email: accountReq.email,
      address: 'Registered Address',
      gender: 'male',
      aadhaar: '123456789012',
      pan: 'ABCDE1234F',
      amount: openingBalance,
      status: 'ACTIVE',
    });

    // Auto-generate virtual debit card for customer
    const cardNum = '4' + Math.floor(1000000000005000 + Math.random() * 8999999999999000).toString().replace(/(.{4})/g, '$1 ').trim();
    await VirtualCard.create({
      accountNumber,
      cardNumber: cardNum,
      cardHolderName: `${accountReq.first_name.toUpperCase()} ${accountReq.last_name.toUpperCase()}`,
      pin: '1234',
      cvv: '888',
      expiryDate: '12/29',
      status: 'Active',
    });

    // Create Initial Deposit Transaction Record
    const now = new Date();
    await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'DEPOSIT',
      accountNumber,
      amount: openingBalance,
      name: `${accountReq.first_name} ${accountReq.last_name}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      description: `Opening Payment Webhook (QR: ${qr_reference_code})`,
    });

    console.log(`[TRANSACTION COMMIT] Account ${accountNumber} created successfully!`);

    res.status(200).json({
      message: 'Payment webhook processed successfully! User & Account created.',
      payment_status: 'SUCCESS',
      request_status: 'COMPLETED',
      assigned_role: 'Retail_Customer',
      account_number: accountNumber,
      username,
      initial_balance: openingBalance,
    });
  } catch (error) {
    console.error(`[TRANSACTION ROLLBACK] Webhook execution failed:`, error.message);

    // Rollback In-Memory Snapshots if failure occurs
    if (paymentSnapshot) {
      const idx = openingPayments.findIndex((p) => p.qr_reference_code === qr_reference_code);
      if (idx !== -1) openingPayments[idx] = paymentSnapshot;
    }

    if (requestSnapshot) {
      const idx = accountRequests.findIndex((r) => r.request_id === requestSnapshot.request_id);
      if (idx !== -1) accountRequests[idx] = requestSnapshot;
    }

    if (createdUser && createdUser._id) {
      await User.deleteOne({ _id: createdUser._id }).catch(() => {});
    }

    if (createdAccount && createdAccount._id) {
      await Account.deleteOne({ _id: createdAccount._id }).catch(() => {});
    }

    res.status(500).json({
      message: 'Transaction Rollback: Payment processing failed.',
      error: error.message,
    });
  }
};
