const mongoose = require('mongoose');

/**
 * Invoice Schema
 * Represents a medical bill/invoice for a patient
 */
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  remainingAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending',
  },
  items: [{
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

/**
 * Calculate remaining amount before saving
 */
invoiceSchema.pre('save', function(next) {
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  // Update status based on payment
  if (this.paidAmount === 0) {
    this.status = this.dueDate < new Date() ? 'Overdue' : 'Pending';
  } else if (this.paidAmount >= this.totalAmount) {
    this.status = 'Paid';
  } else {
    this.status = 'Partially Paid';
  }
  
  next();
});

/**
 * Update payment amount and recalculate
 */
invoiceSchema.methods.applyPayment = function(amount) {
  this.paidAmount += amount;
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  if (this.paidAmount >= this.totalAmount) {
    this.status = 'Paid';
  } else {
    this.status = 'Partially Paid';
  }
  
  return this.save();
};

/**
 * Check if invoice is fully paid
 */
invoiceSchema.methods.isFullyPaid = function() {
  return this.paidAmount >= this.totalAmount;
};

/**
 * Check if invoice is overdue
 */
invoiceSchema.methods.isOverdue = function() {
  return !this.isFullyPaid() && this.dueDate < new Date();
};

module.exports = mongoose.model('Invoice', invoiceSchema);

