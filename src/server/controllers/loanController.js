const GoldLoan = require('../models/GoldLoan');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.applyGoldLoan = async (req, res) => {
  try {
    const { name, account_number, gold_weight, locker_number, loan_amount, email } = req.body;

    if (!account_number || !gold_weight || !loan_amount) {
      return res.status(400).json({ message: 'Account number, gold weight, and loan amount are required.' });
    }

    const account = await Account.findOne({ accountNumber: account_number });
    if (!account) {
      return res.status(404).json({ message: 'Associated savings account not found.' });
    }

    const loanAccountNumber = 'GL' + Math.floor(1000000 + Math.random() * 9000000).toString();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const newLoan = await GoldLoan.create({
      loanAccountNumber,
      name: name || `${account.fname} ${account.surname}`,
      accountNumber: account_number,
      goldWeight: Number(gold_weight),
      lockerNumber: Number(locker_number) || Math.floor(100 + Math.random() * 900),
      loanAmount: Number(loan_amount),
      interestRate: 8.5,
      email: email || account.email,
      startDate: dateStr,
      status: 'ACTIVE',
    });

    // Credit loan amount to savings account balance
    account.amount += Number(loan_amount);
    await account.save();

    // Log transaction
    await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'LOAN_DISBURSEMENT',
      accountNumber: account_number,
      amount: Number(loan_amount),
      name: newLoan.name,
      date: dateStr,
      time: now.toTimeString().split(' ')[0],
      description: `Gold Loan Disbursement (${loanAccountNumber})`,
    });

    res.status(201).json({
      message: 'Gold loan application approved and amount disbursed to account!',
      loan: newLoan,
      newBalance: account.amount,
    });
  } catch (error) {
    console.error('Apply Gold Loan Error:', error);
    res.status(500).json({ message: 'Server error applying for loan' });
  }
};

exports.getLoans = async (req, res) => {
  try {
    const { account_number } = req.query;
    let query = {};
    if (account_number) {
      query.accountNumber = account_number;
    }

    const loans = await GoldLoan.find(query).sort({ createdAt: -1 });
    res.json({ loans });
  } catch (error) {
    console.error('Get Loans Error:', error);
    res.status(500).json({ message: 'Server error fetching loans' });
  }
};

exports.repayLoan = async (req, res) => {
  try {
    const { loan_account_number, amount } = req.body;
    const repayAmount = Number(amount);

    if (!loan_account_number || !repayAmount || repayAmount <= 0) {
      return res.status(400).json({ message: 'Valid loan account number and payment amount are required.' });
    }

    const loan = await GoldLoan.findOne({ loanAccountNumber: loan_account_number });
    if (!loan) {
      return res.status(404).json({ message: 'Loan account not found.' });
    }

    const account = await Account.findOne({ accountNumber: loan.accountNumber });
    if (account) {
      if (account.amount < repayAmount) {
        return res.status(400).json({ message: `Insufficient balance in linked account ${account.accountNumber} for repayment.` });
      }
      account.amount -= repayAmount;
      await account.save();
    }

    loan.repaidAmount += repayAmount;
    if (loan.repaidAmount >= loan.loanAmount) {
      loan.status = 'PAID_OFF';
    }
    await loan.save();

    const now = new Date();
    await Transaction.create({
      transactionId: 'TXN' + Date.now().toString().slice(-6),
      type: 'LOAN_REPAYMENT',
      accountNumber: loan.accountNumber,
      amount: repayAmount,
      name: loan.name,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      description: `Repayment for Gold Loan (${loan_account_number})`,
    });

    res.json({
      message: `Repayment of ₹${repayAmount.toLocaleString()} recorded for loan ${loan_account_number}.`,
      loan,
    });
  } catch (error) {
    console.error('Repay Loan Error:', error);
    res.status(500).json({ message: 'Server error processing loan repayment' });
  }
};
