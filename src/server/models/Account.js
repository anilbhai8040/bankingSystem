const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema({
  fname: { type: String, default: '' },
  father: { type: String, default: '' },
  surname: { type: String, default: '' },
  relationship: { type: String, default: '' },
  address: { type: String, default: '' },
});

const documentSchema = new mongoose.Schema({
  signature: { type: String, default: null },
  photo: { type: String, default: null },
  aadhaarDoc: { type: String, default: null },
  panDoc: { type: String, default: null },
});

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  fname: { type: String, required: true },
  father: { type: String, required: true },
  surname: { type: String, required: true },
  dob: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  aadhaar: { type: String, required: true },
  pan: { type: String, required: true },
  amount: { type: Number, default: 0 },
  nominee: { type: nomineeSchema, default: () => ({}) },
  documents: { type: documentSchema, default: () => ({}) },
  status: { type: String, enum: ['ACTIVE', 'CLOSED', 'SUSPENDED'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
