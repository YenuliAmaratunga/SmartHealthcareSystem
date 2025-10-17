const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const SavedCard = require('../models/SavedCard');
const stripeService = require('./stripeService');
const notificationService = require('./notificationService');

/**
 * Payment Service
 * Handles payment business logic and orchestration
 * Following SOLID principles
 */
class PaymentService {
  
  /**
   * Initiate a new card payment
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} Payment details with client secret
   */
  async initiateCardPayment(paymentData) {
    try {
      const { patientId, invoiceId, amount, paymentType, patientInfo } = paymentData;
      
      // Validate invoice
      const invoice = await this.validateInvoice(invoiceId, patientId, amount, paymentType);
      
      // Create or get Stripe customer
      const stripeCustomerId = await stripeService.createOrGetCustomer({
        patientId,
        email: patientInfo.email,
        name: patientInfo.name,
        phone: patientInfo.phone,
      });
      
      // Create payment intent
      const { clientSecret, paymentIntentId } = await stripeService.createPaymentIntent({
        amount,
        customerId: stripeCustomerId,
        description: `Payment for Invoice ${invoice.invoiceNumber}`,
        metadata: {
          patientId: patientId.toString(),
          invoiceId: invoiceId.toString(),
          invoiceNumber: invoice.invoiceNumber,
        },
      });
      
      // Create payment record
      const payment = new Payment({
        patientId,
        invoiceId,
        amount,
        paymentType,
        paymentMethod: 'Card',
        status: 'Pending',
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId,
      });
      
      await payment.save();
      
      return {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        clientSecret,
        amount,
        invoiceNumber: invoice.invoiceNumber,
      };
    } catch (error) {
      throw new Error(`Failed to initiate payment: ${error.message}`);
    }
  }
  
  /**
   * Process payment with saved card
   * @param {Object} paymentData - Payment information with saved card
   * @returns {Promise<Object>} Payment result
   */
  async processSavedCardPayment(paymentData) {
    try {
      const { patientId, invoiceId, amount, paymentType, savedCardId } = paymentData;
      
      // Validate invoice
      const invoice = await this.validateInvoice(invoiceId, patientId, amount, paymentType);
      
      // Get saved card
      const savedCard = await SavedCard.findOne({
        _id: savedCardId,
        patientId,
        isActive: true,
      });
      
      if (!savedCard) {
        throw new Error('Saved card not found or inactive');
      }
      
      if (savedCard.isExpired()) {
        throw new Error('Card has expired');
      }
      
      // Create payment intent with saved card
      const { paymentIntentId, status } = await stripeService.createPaymentIntentWithSavedCard({
        amount,
        customerId: savedCard.stripeCustomerId,
        paymentMethodId: savedCard.stripePaymentMethodId,
        description: `Payment for Invoice ${invoice.invoiceNumber}`,
        metadata: {
          patientId: patientId.toString(),
          invoiceId: invoiceId.toString(),
          invoiceNumber: invoice.invoiceNumber,
        },
      });
      
      // Create payment record
      const payment = new Payment({
        patientId,
        invoiceId,
        amount,
        paymentType,
        paymentMethod: 'SavedCard',
        status: status === 'succeeded' ? 'Completed' : 'Processing',
        stripePaymentIntentId: paymentIntentId,
        stripeCustomerId: savedCard.stripeCustomerId,
        stripePaymentMethodId: savedCard.stripePaymentMethodId,
        cardDetails: {
          brand: savedCard.cardBrand,
          last4: savedCard.last4,
          expiryMonth: savedCard.expiryMonth,
          expiryYear: savedCard.expiryYear,
        },
      });
      
      if (status === 'succeeded') {
        payment.paymentDate = new Date();
        
        // Update invoice
        await invoice.applyPayment(amount);
        
        // Send confirmation notification
        await notificationService.sendPaymentConfirmation({
          patientId,
          invoiceNumber: invoice.invoiceNumber,
          amount,
          transactionId: payment.transactionId,
        });
      }
      
      await payment.save();
      
      return {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        status: payment.status,
        amount,
        invoiceNumber: invoice.invoiceNumber,
      };
    } catch (error) {
      throw new Error(`Failed to process saved card payment: ${error.message}`);
    }
  }
  
  /**
   * Confirm payment after successful Stripe processing
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {Promise<Object>} Confirmed payment details
   */
  async confirmPayment(paymentIntentId) {
    try {
      // Find payment by payment intent ID
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Retrieve payment intent from Stripe
      const stripePayment = await stripeService.retrievePaymentIntent(paymentIntentId);
      
      if (stripePayment.status === 'succeeded') {
        // Update payment status
        await payment.markCompleted(paymentIntentId);
        
        // Update invoice
        const invoice = await Invoice.findById(payment.invoiceId);
        await invoice.applyPayment(payment.amount);
        
        // Send confirmation notification
        await notificationService.sendPaymentConfirmation({
          patientId: payment.patientId,
          invoiceNumber: invoice.invoiceNumber,
          amount: payment.amount,
          transactionId: payment.transactionId,
        });
        
        return {
          success: true,
          transactionId: payment.transactionId,
          status: 'Completed',
          message: 'Payment completed successfully',
        };
      } else {
        throw new Error(`Payment not successful. Status: ${stripePayment.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }
  
  /**
   * Handle payment failure
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @param {Object} errorInfo - Error information
   * @returns {Promise<Object>} Failure details
   */
  async handlePaymentFailure(paymentIntentId, errorInfo) {
    try {
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
      
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      await payment.markFailed(errorInfo.code || 'unknown', errorInfo.message);
      
      return {
        success: false,
        transactionId: payment.transactionId,
        canRetry: payment.canRetry(),
        message: errorInfo.message,
      };
    } catch (error) {
      throw new Error(`Failed to handle payment failure: ${error.message}`);
    }
  }
  
  /**
   * Save a new payment method
   * @param {Object} cardData - Card information
   * @returns {Promise<Object>} Saved card details
   */
  async savePaymentMethod(cardData) {
    try {
      const { patientId, paymentMethodId, customerId, cardholderName } = cardData;
      
      // Get payment method details from Stripe
      const cardInfo = await stripeService.savePaymentMethod({
        paymentMethodId,
        customerId,
      });
      
      // Check if card already exists
      const existingCard = await SavedCard.findOne({
        patientId,
        last4: cardInfo.last4,
        expiryMonth: cardInfo.expiryMonth,
        expiryYear: cardInfo.expiryYear,
      });
      
      if (existingCard) {
        throw new Error('This card is already saved');
      }
      
      // Create saved card record
      const savedCard = new SavedCard({
        patientId,
        stripeCustomerId: customerId,
        stripePaymentMethodId: paymentMethodId,
        cardBrand: cardInfo.brand,
        last4: cardInfo.last4,
        expiryMonth: cardInfo.expiryMonth,
        expiryYear: cardInfo.expiryYear,
        cardholderName,
        isDefault: false,
      });
      
      await savedCard.save();
      
      return {
        cardId: savedCard._id,
        displayName: savedCard.getDisplayName(),
        brand: savedCard.cardBrand,
        last4: savedCard.last4,
        expiryMonth: savedCard.expiryMonth,
        expiryYear: savedCard.expiryYear,
      };
    } catch (error) {
      throw new Error(`Failed to save payment method: ${error.message}`);
    }
  }
  
  /**
   * Get patient's saved cards
   * @param {string} patientId - Patient ID
   * @returns {Promise<Array>} List of saved cards
   */
  async getSavedCards(patientId) {
    try {
      const savedCards = await SavedCard.find({
        patientId,
        isActive: true,
      }).sort({ isDefault: -1, createdAt: -1 });
      
      return savedCards.map(card => ({
        cardId: card._id,
        displayName: card.getDisplayName(),
        maskedNumber: card.getMaskedNumber(),
        brand: card.cardBrand,
        last4: card.last4,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        isDefault: card.isDefault,
        isExpired: card.isExpired(),
      }));
    } catch (error) {
      throw new Error(`Failed to get saved cards: ${error.message}`);
    }
  }
  
  /**
   * Remove a saved card
   * @param {string} cardId - Saved card ID
   * @param {string} patientId - Patient ID
   * @returns {Promise<boolean>} Success status
   */
  async removeSavedCard(cardId, patientId) {
    try {
      const savedCard = await SavedCard.findOne({ _id: cardId, patientId });
      
      if (!savedCard) {
        throw new Error('Card not found');
      }
      
      // Detach from Stripe
      await stripeService.removePaymentMethod(savedCard.stripePaymentMethodId);
      
      // Mark as inactive instead of deleting
      savedCard.isActive = false;
      await savedCard.save();
      
      return true;
    } catch (error) {
      throw new Error(`Failed to remove card: ${error.message}`);
    }
  }
  
  /**
   * Get patient's payment history
   * @param {string} patientId - Patient ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Payment history
   */
  async getPaymentHistory(patientId, filters = {}) {
    try {
      const query = { patientId };
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
        if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
      }
      
      const payments = await Payment.find(query)
        .populate('invoiceId', 'invoiceNumber totalAmount')
        .sort({ createdAt: -1 })
        .limit(filters.limit || 50);
      
      return payments.map(payment => ({
        transactionId: payment.transactionId,
        amount: payment.amount,
        paymentType: payment.paymentType,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        paymentDate: payment.paymentDate,
        invoiceNumber: payment.invoiceId?.invoiceNumber,
        cardDetails: payment.cardDetails,
      }));
    } catch (error) {
      throw new Error(`Failed to get payment history: ${error.message}`);
    }
  }
  
  /**
   * Validate invoice for payment
   * @private
   * @param {string} invoiceId - Invoice ID
   * @param {string} patientId - Patient ID
   * @param {number} amount - Payment amount
   * @param {string} paymentType - Full or Partial
   * @returns {Promise<Object>} Validated invoice
   */
  async validateInvoice(invoiceId, patientId, amount, paymentType) {
    const invoice = await Invoice.findOne({
      _id: invoiceId,
      patientId,
    });
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    if (invoice.status === 'Paid') {
      throw new Error('Invoice is already fully paid');
    }
    
    if (invoice.status === 'Cancelled') {
      throw new Error('Invoice has been cancelled');
    }
    
    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }
    
    if (amount > invoice.remainingAmount) {
      throw new Error('Payment amount exceeds remaining balance');
    }
    
    if (paymentType === 'Full' && amount < invoice.remainingAmount) {
      throw new Error('Full payment amount must equal remaining balance');
    }
    
    return invoice;
  }
  
  /**
   * Get patient's invoices
   * @param {string} patientId - Patient ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} List of invoices
   */
  async getPatientInvoices(patientId, filters = {}) {
    try {
      const query = { patientId };
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      const invoices = await Invoice.find(query)
        .sort({ issueDate: -1 })
        .limit(filters.limit || 50);
      
      return invoices.map(invoice => ({
        invoiceId: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        paidAmount: invoice.paidAmount,
        remainingAmount: invoice.remainingAmount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        isOverdue: invoice.isOverdue(),
        items: invoice.items,
      }));
    } catch (error) {
      throw new Error(`Failed to get invoices: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();

