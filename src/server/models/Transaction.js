const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'FD_CREATION'],
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    index: true,
  },
  fromAccount: {
    type: String,
    default: null,
  },
  toAccount: {
    type: String,
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: 'Customer',
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
