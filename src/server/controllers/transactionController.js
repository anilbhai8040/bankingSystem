const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.deposit = async (req, res) => {
  try {
    const { account_number, amount } = req.body;
    const depositAmount = Number(amount);

    if (!account_number || !depositAmount || depositAmount <= 0) {
      return res.status(400).json({ message: 'Valid account number and positive amount are required.' });
    }

    const account = await Account.findOne({ accountNumber: account_number });
    if (!account) {
      return res.status(404).json({ message: 'Account not found. Please verify the account number.' });
    }

    // Update account balance
    account.amount += depositAmount;
    await account.save();

    // Log transaction
    const now = new Date();
    const txn = await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'DEPOSIT',
      accountNumber: account.accountNumber,
      amount: depositAmount,
      name: `${account.fname} ${account.surname}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      description: 'Cash Deposit',
    });

    res.json({
      message: `Successfully deposited ₹${depositAmount.toLocaleString()} into account ${account_number}`,
      newBalance: account.amount,
      transaction: txn,
    });
  } catch (error) {
    console.error('Deposit Error:', error);
    res.status(500).json({ message: 'Server error during deposit' });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { account_number, amount } = req.body;
    const withdrawAmount = Number(amount);

    if (!account_number || !withdrawAmount || withdrawAmount <= 0) {
      return res.status(400).json({ message: 'Valid account number and positive amount are required.' });
    }

    const account = await Account.findOne({ accountNumber: account_number });
    if (!account) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    if (account.amount < withdrawAmount) {
      return res.status(400).json({ message: `Insufficient balance! Current balance: ₹${account.amount}` });
    }

    // Update balance
    account.amount -= withdrawAmount;
    await account.save();

    // Log transaction
    const now = new Date();
    const txn = await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'WITHDRAWAL',
      accountNumber: account.accountNumber,
      amount: withdrawAmount,
      name: `${account.fname} ${account.surname}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      description: 'Cash Withdrawal',
    });

    res.json({
      message: `Successfully withdrew ₹${withdrawAmount.toLocaleString()} from account ${account_number}`,
      newBalance: account.amount,
      transaction: txn,
    });
  } catch (error) {
    console.error('Withdraw Error:', error);
    res.status(500).json({ message: 'Server error during withdrawal' });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { from_account, to_account, amount } = req.body;
    const transferAmount = Number(amount);

    if (!from_account || !to_account || !transferAmount || transferAmount <= 0) {
      return res.status(400).json({ message: 'From account, to account, and positive amount are required.' });
    }

    if (from_account === to_account) {
      return res.status(400).json({ message: 'Source and destination accounts cannot be identical.' });
    }

    const sourceAccount = await Account.findOne({ accountNumber: from_account });
    const targetAccount = await Account.findOne({ accountNumber: to_account });

    if (!sourceAccount) {
      return res.status(404).json({ message: `Source account ${from_account} not found.` });
    }
    if (!targetAccount) {
      return res.status(404).json({ message: `Target account ${to_account} not found.` });
    }

    if (sourceAccount.amount < transferAmount) {
      return res.status(400).json({ message: `Insufficient funds in source account. Available: ₹${sourceAccount.amount}` });
    }

    // Execute transfer
    sourceAccount.amount -= transferAmount;
    targetAccount.amount += transferAmount;

    await sourceAccount.save();
    await targetAccount.save();

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const txn = await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'TRANSFER',
      accountNumber: sourceAccount.accountNumber,
      fromAccount: sourceAccount.accountNumber,
      toAccount: targetAccount.accountNumber,
      amount: transferAmount,
      name: `${sourceAccount.fname} ${sourceAccount.surname}`,
      date: dateStr,
      time: timeStr,
      description: `Transfer to Acc ${targetAccount.accountNumber}`,
    });

    res.json({
      message: `Successfully transferred ₹${transferAmount.toLocaleString()} to account ${to_account}`,
      newBalance: sourceAccount.amount,
      transaction: txn,
    });
  } catch (error) {
    console.error('Transfer Error:', error);
    res.status(500).json({ message: 'Server error during transfer' });
  }
};

exports.getStatements = async (req, res) => {
  try {
    const { account_number, type } = req.query;
    let query = {};

    if (account_number) {
      query.accountNumber = account_number;
    }
    if (type) {
      query.type = type.toUpperCase();
    }

    const statements = await Transaction.find(query).sort({ createdAt: -1 });

    res.json({
      count: statements.length,
      statements,
    });
  } catch (error) {
    console.error('Get Statements Error:', error);
    res.status(500).json({ message: 'Server error fetching statements' });
  }
};
