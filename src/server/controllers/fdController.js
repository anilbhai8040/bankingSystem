const FDAccount = require('../models/FDAccount');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.createFD = async (req, res) => {
  try {
    const { account_number, amount, time, email } = req.body;
    const fdAmount = Number(amount);
    const timeYears = Number(time);

    if (!account_number || !fdAmount || fdAmount < 5000 || !timeYears || timeYears < 1) {
      return res.status(400).json({ message: 'Minimum FD amount is ₹5,000 and minimum period is 1 year.' });
    }

    const account = await Account.findOne({ accountNumber: account_number });
    if (!account) {
      return res.status(404).json({ message: 'Savings account not found.' });
    }

    if (account.amount < fdAmount) {
      return res.status(400).json({ message: `Insufficient balance in savings account to open FD. Available: ₹${account.amount}` });
    }

    // Calculate maturity with 7.5% per annum interest
    const interestRate = 7.5;
    const maturityAmount = Math.round(fdAmount * Math.pow(1 + interestRate / 100, timeYears));

    const fdAccountNumber = 'FD' + Math.floor(1000000 + Math.random() * 9000000).toString();
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    
    const endDate = new Date(now.setFullYear(now.getFullYear() + timeYears)).toISOString().split('T')[0];

    // Deduct amount from savings account
    account.amount -= fdAmount;
    await account.save();

    const newFD = await FDAccount.create({
      fdAccountNumber,
      accountNumber: account_number,
      startDate,
      endDate,
      timeInYears: timeYears,
      amount: fdAmount,
      interestRate,
      maturityAmount,
      email: email || account.email,
      status: 'ACTIVE',
    });

    // Record transaction
    await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'FD_CREATION',
      accountNumber: account_number,
      amount: fdAmount,
      name: `${account.fname} ${account.surname}`,
      date: startDate,
      time: new Date().toTimeString().split(' ')[0],
      description: `Fixed Deposit Created (${fdAccountNumber})`,
    });

    res.status(201).json({
      message: 'Fixed Deposit created successfully!',
      fd: newFD,
      remainingSavingsBalance: account.amount,
    });
  } catch (error) {
    console.error('Create FD Error:', error);
    res.status(500).json({ message: 'Server error creating Fixed Deposit' });
  }
};

exports.getFDs = async (req, res) => {
  try {
    const { account_number } = req.query;
    let query = {};
    if (account_number) {
      query.accountNumber = account_number;
    }

    const fds = await FDAccount.find(query).sort({ createdAt: -1 });
    res.json({ fds });
  } catch (error) {
    console.error('Get FDs Error:', error);
    res.status(500).json({ message: 'Server error fetching FD accounts' });
  }
};
