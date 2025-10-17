const mongoose = require('mongoose');

/**
 * Payment Schema
 * Records all payment transactions for invoices
 */
const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true,
  },
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  paymentType: {
    type: String,
    enum: ['Full', 'Partial'],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'SavedCard'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Cancelled'],
    default: 'Pending',
    index: true,
  },
  // Stripe-specific fields
  stripePaymentIntentId: {
    type: String,
    index: true,
  },
  stripePaymentMethodId: {
    type: String,
  },
  stripeCustomerId: {
    type: String,
  },
  // Card information (for display only - no sensitive data)
  cardDetails: {
    brand: String,
    last4: String,
    expiryMonth: Number,
    expiryYear: Number,
  },
  // Payment metadata
  paymentDate: {
    type: Date,
  },
  failureReason: {
    type: String,
  },
  failureMessage: {
    type: String,
  },
  refundReason: {
    type: String,
  },
  refundDate: {
    type: Date,
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

/**
 * Generate unique transaction ID
 */
paymentSchema.pre('validate', function (next) {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.log('✅ Generated transactionId:', this.transactionId);
  }
  next();
});


/**
 * Mark payment as completed
 */
paymentSchema.methods.markCompleted = function(stripePaymentIntentId) {
  this.status = 'Completed';
  this.paymentDate = new Date();
  this.stripePaymentIntentId = stripePaymentIntentId;
  return this.save();
};

/**
 * Mark payment as failed
 */
paymentSchema.methods.markFailed = function(reason, message) {
  this.status = 'Failed';
  this.failureReason = reason;
  this.failureMessage = message;
  this.retryCount += 1;
  return this.save();
};

/**
 * Check if payment can be retried
 */
paymentSchema.methods.canRetry = function() {
  return this.status === 'Failed' && this.retryCount < 3;
};

module.exports = mongoose.model('Payment', paymentSchema);
