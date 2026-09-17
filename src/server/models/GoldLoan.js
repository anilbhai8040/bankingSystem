const mongoose = require('mongoose');

const goldLoanSchema = new mongoose.Schema({
  loanAccountNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    index: true,
  },
  goldWeight: {
    type: Number, // in grams
    required: true,
  },
  lockerNumber: {
    type: Number,
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    default: 8.5, // 8.5% interest
  },
  email: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAID_OFF', 'CLOSED'],
    default: 'ACTIVE',
  },
  repaidAmount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('GoldLoan', goldLoanSchema);
