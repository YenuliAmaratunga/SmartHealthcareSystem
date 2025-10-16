const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',   // referencing Patient collection
    required: true,
  },
  billId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['Stripe'], 
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  stripePaymentIntentId: {   // To store Stripe payment intent reference
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
