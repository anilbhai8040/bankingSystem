const mongoose = require('mongoose');

const fdAccountSchema = new mongoose.Schema({
  fdAccountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  accountNumber: {
    type: String,
    required: true,
    index: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  timeInYears: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    default: 7.5, // 7.5% per annum default
  },
  maturityAmount: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'MATURED', 'CLOSED'],
    default: 'ACTIVE',
  }
}, { timestamps: true });

module.exports = mongoose.model('FDAccount', fdAccountSchema);
