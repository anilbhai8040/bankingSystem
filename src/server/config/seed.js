const bcrypt = require('bcrypt');
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const FDAccount = require('../models/FDAccount');
const GoldLoan = require('../models/GoldLoan');
const VirtualCard = require('../models/VirtualCard');

async function seedDatabase() {
  try {
    const existingAccounts = await Account.countDocuments();
    if (existingAccounts > 0) {
      console.log('Database already has data. Skipping initial seeding.');
      return;
    }

    console.log('Seeding initial Nova Crest Bank demo data...');

    // 1. Create demo User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const demoUser = await User.create({
      username: 'admin',
      email: 'admin@novacrestbank.com',
      password: hashedPassword,
      role: 'admin',
    });

    // 2. Create Primary Savings Account
    const primaryAccount = await Account.create({
      accountNumber: '1002003001',
      user: demoUser._id,
      fname: 'Alex',
      father: 'Robert',
      surname: 'Morgan',
      dob: '1992-05-15',
      mobile: '9876543210',
      email: 'alex.morgan@novacrestbank.com',
      address: '123 Tech Park Avenue, Silicon Bay',
      gender: 'male',
      aadhaar: '123456789012',
      pan: 'ABCDE1234F',
      amount: 125000,
      nominee: {
        fname: 'Sarah',
        father: 'Alex',
        surname: 'Morgan',
        relationship: 'Wife',
        address: '123 Tech Park Avenue, Silicon Bay',
      },
      status: 'ACTIVE',
    });

    // 3. Create Secondary Account
    const secondaryAccount = await Account.create({
      accountNumber: '1002003002',
      user: demoUser._id,
      fname: 'Sophia',
      father: 'James',
      surname: 'Carter',
      dob: '1995-09-20',
      mobile: '9812345678',
      email: 'sophia.carter@novacrestbank.com',
      address: '45 Park Hill, Metro City',
      gender: 'female',
      aadhaar: '987654321098',
      pan: 'XYZPS9876K',
      amount: 48500,
      nominee: {
        fname: 'James',
        father: 'Robert',
        surname: 'Carter',
        relationship: 'Son',
        address: '45 Park Hill, Metro City',
      },
      status: 'ACTIVE',
    });

    // 4. Create Initial Transactions
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    await Transaction.create([
      {
        transactionId: 'TXN10001',
        type: 'DEPOSIT',
        accountNumber: '1002003001',
        amount: 100000,
        name: 'Alex Morgan',
        date: dateStr,
        time: timeStr,
        description: 'Initial Deposit',
      },
      {
        transactionId: 'TXN10002',
        type: 'DEPOSIT',
        accountNumber: '1002003001',
        amount: 30000,
        name: 'Alex Morgan',
        date: dateStr,
        time: timeStr,
        description: 'Salary Credit',
      },
      {
        transactionId: 'TXN10003',
        type: 'WITHDRAWAL',
        accountNumber: '1002003001',
        amount: 5000,
        name: 'Alex Morgan',
        date: dateStr,
        time: timeStr,
        description: 'ATM Withdrawal',
      },
      {
        transactionId: 'TXN10004',
        type: 'DEPOSIT',
        accountNumber: '1002003002',
        amount: 48500,
        name: 'Sophia Carter',
        date: dateStr,
        time: timeStr,
        description: 'Initial Opening Balance',
      }
    ]);

    // 5. Create FD Account
    await FDAccount.create({
      fdAccountNumber: 'FD9001001',
      accountNumber: '1002003001',
      startDate: dateStr,
      endDate: '2027-09-17',
      timeInYears: 3,
      amount: 50000,
      interestRate: 7.5,
      maturityAmount: 62150,
      email: 'alex.morgan@novacrestbank.com',
      status: 'ACTIVE',
    });

    // 6. Create Gold Loan
    await GoldLoan.create({
      loanAccountNumber: 'GL5001001',
      name: 'Alex Morgan',
      accountNumber: '1002003001',
      goldWeight: 25, // grams
      lockerNumber: 108,
      loanAmount: 85000,
      interestRate: 8.5,
      email: 'alex.morgan@novacrestbank.com',
      startDate: dateStr,
      status: 'ACTIVE',
      repaidAmount: 15000,
    });

    // 7. Create Virtual Cards
    await VirtualCard.create([
      {
        accountNumber: '1002003001',
        cardNumber: '4532 8910 2341 9012',
        cardHolderName: 'ALEX MORGAN',
        pin: '1234',
        cvv: '891',
        expiryDate: '09/29',
        cardType: 'DEBIT',
        status: 'Active',
      },
      {
        accountNumber: '1002003002',
        cardNumber: '4111 2222 3333 4444',
        cardHolderName: 'SOPHIA CARTER',
        pin: '4321',
        cvv: '567',
        expiryDate: '11/28',
        cardType: 'DEBIT',
        status: 'Active',
      }
    ]);

    console.log('Nova Crest Bank seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = seedDatabase;
