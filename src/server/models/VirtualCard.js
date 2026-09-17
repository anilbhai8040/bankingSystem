const mongoose = require('mongoose');

const virtualCardSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    index: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  cardHolderName: {
    type: String,
    default: 'VALUED CUSTOMER',
  },
  pin: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    default: '888',
  },
  expiryDate: {
    type: String,
    default: '12/29',
  },
  cardType: {
    type: String,
    enum: ['DEBIT', 'CREDIT'],
    default: 'DEBIT',
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active',
  }
}, { timestamps: true });

module.exports = mongoose.model('VirtualCard', virtualCardSchema);
