const Account = require('../models/Account');
const VirtualCard = require('../models/VirtualCard');
const Transaction = require('../models/Transaction');

// Utility helper to generate unique 10-digit account number
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

exports.createAccount = async (req, res) => {
  try {
    const {
      fname, father, surname, dob, mobile, email, address, gender,
      aadhaar, pan, nt1, nt2, nt3, nt4, nt5, initialDeposit
    } = req.body;

    if (!fname || !father || !surname || !mobile || !email || !aadhaar || !pan) {
      return res.status(400).json({ message: 'All required personal and KYC fields must be filled.' });
    }

    const openingBalance = Number(initialDeposit) || 0;
    if (openingBalance < 500) {
      return res.status(400).json({ message: 'Minimum opening deposit of ₹500 is required to open an account with Nova Crest Bank.' });
    }

    const accountNumber = await generateAccountNumber();

    // Extract file names if uploaded
    const signature = req.files && req.files['signature'] ? req.files['signature'][0].filename : null;
    const photo = req.files && req.files['photo'] ? req.files['photo'][0].filename : null;
    const aadhaarDoc = req.files && req.files['aadhaar_doc'] ? req.files['aadhaar_doc'][0].filename : null;
    const panDoc = req.files && req.files['pan_doc'] ? req.files['pan_doc'][0].filename : null;

    const newAccount = new Account({
      accountNumber,
      user: req.user ? req.user.id : null,
      fname,
      father,
      surname,
      dob: dob || '1995-01-01',
      mobile,
      email,
      address,
      gender: gender || 'male',
      aadhaar,
      pan,
      amount: openingBalance,
      nominee: {
        fname: nt1 || '',
        father: nt2 || '',
        surname: nt3 || '',
        relationship: nt4 || '',
        address: nt5 || '',
      },
      documents: {
        signature,
        photo,
        aadhaarDoc,
        panDoc,
      }
    });

    await newAccount.save();

    // Auto-generate virtual debit card for the new account
    const cardNum = '4' + Math.floor(1000000000005000 + Math.random() * 8999999999999000).toString().replace(/(.{4})/g, '$1 ').trim();
    await VirtualCard.create({
      accountNumber,
      cardNumber: cardNum,
      cardHolderName: `${fname.toUpperCase()} ${surname.toUpperCase()}`,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      expiryDate: '12/29',
      status: 'Active',
    });

    // Create initial deposit transaction
    const now = new Date();
    await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'DEPOSIT',
      accountNumber,
      amount: openingBalance,
      name: `${fname} ${surname}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      description: 'Account Opening Deposit (Min ₹500 rule enforced)',
    });

    res.status(201).json({
      message: 'Account created successfully with minimum deposit!',
      accountNumber,
      account: newAccount
    });
  } catch (error) {
    console.error('Account Creation Error:', error);
    res.status(500).json({ message: 'Server error creating account', error: error.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const { account_number } = req.params;
    const account = await Account.findOne({ accountNumber: account_number });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({
      accountNumber: account.accountNumber,
      name: `${account.fname} ${account.surname}`,
      balance: account.amount,
      status: account.status,
    });
  } catch (error) {
    console.error('Get Balance Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAccountDetails = async (req, res) => {
  try {
    const { account_number } = req.params;
    const account = await Account.findOne({ accountNumber: account_number });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({ account });
  } catch (error) {
    console.error('Get Account Details Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().sort({ createdAt: -1 });
    res.json({ accounts });
  } catch (error) {
    console.error('Get All Accounts Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { account_number } = req.params;
    const account = await Account.findOne({ accountNumber: account_number });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await Account.deleteOne({ accountNumber: account_number });
    await VirtualCard.deleteMany({ accountNumber: account_number });

    res.json({ message: `Account ${account_number} successfully deleted.` });
  } catch (error) {
    console.error('Delete Account Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
