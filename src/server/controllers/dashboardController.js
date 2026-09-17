const Account = require('../models/Account');
const FDAccount = require('../models/FDAccount');
const GoldLoan = require('../models/GoldLoan');
const Transaction = require('../models/Transaction');

exports.getOverview = async (req, res) => {
  try {
    const totalAccounts = await Account.countDocuments();
    const countSavings = await Account.countDocuments({ status: 'ACTIVE' });
    const countFD = await FDAccount.countDocuments({ status: 'ACTIVE' });
    const countLoan = await GoldLoan.countDocuments({ status: 'ACTIVE' });

    // Aggregate total amount across all savings accounts
    const balanceAgg = await Account.aggregate([
      { $group: { _id: null, totalBalance: { $sum: '$amount' } } }
    ]);

    const totalAmount = balanceAgg.length > 0 ? balanceAgg[0].totalBalance : 0;

    // Fetch recent 5 transactions
    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);

    // Primary account detail
    const primaryAccount = await Account.findOne().sort({ createdAt: 1 });

    res.json({
      success: true,
      total_amount: totalAmount,
      count_saving: countSavings,
      count_fd: countFD,
      count_loan: countLoan,
      total_accounts: totalAccounts,
      primary_account: primaryAccount,
      recent_transactions: recentTransactions,
    });
  } catch (error) {
    console.error('Dashboard Overview Error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard metrics' });
  }
};
