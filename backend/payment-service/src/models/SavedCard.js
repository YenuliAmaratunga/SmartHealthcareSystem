const mongoose = require('mongoose');

/**
 * SavedCard Schema
 * Stores tokenized payment card information for patients
 * NEVER stores actual card numbers - only Stripe tokens
 */
const savedCardSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
    index: true,
  },
  stripePaymentMethodId: {
    type: String,
    required: true,
    unique: true,
  },
  cardBrand: {
    type: String,
    required: true,
    enum: ['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', 'unionpay', 'unknown'],
  },
  last4: {
    type: String,
    required: true,
    length: 4,
  },
  expiryMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  expiryYear: {
    type: Number,
    required: true,
    min: new Date().getFullYear(),
  },
  cardholderName: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

/**
 * Index for quick lookup of patient's default card
 */
savedCardSchema.index({ patientId: 1, isDefault: 1 });

/**
 * Ensure only one default card per patient
 */
savedCardSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default flag from other cards of this patient
    await this.constructor.updateMany(
      { patientId: this.patientId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

/**
 * Check if card is expired
 */
savedCardSchema.methods.isExpired = function() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  
  return this.expiryYear < currentYear || 
         (this.expiryYear === currentYear && this.expiryMonth < currentMonth);
};

/**
 * Get masked card number for display
 */
savedCardSchema.methods.getMaskedNumber = function() {
  return `•••• •••• •••• ${this.last4}`;
};

/**
 * Get display name for card
 */
savedCardSchema.methods.getDisplayName = function() {
  const brand = this.cardBrand.charAt(0).toUpperCase() + this.cardBrand.slice(1);
  return `${brand} ••${this.last4}`;
};

module.exports = mongoose.model('SavedCard', savedCardSchema);

