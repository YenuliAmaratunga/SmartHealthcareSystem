const paymentService = require('../services/paymentService');
const stripeService = require('../services/stripeService');
const { body, param, query, validationResult } = require('express-validator');

/**
 * Payment Controller
 * Handles HTTP requests for payment operations
 * Following best practices with validation and error handling
 */

/**
 * Validate request and return errors if any
 */
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  return null;
};

/**
 * @route   POST /api/payments/initiate-card-payment
 * @desc    Initiate a new card payment (Main Success Scenario - Steps 1-10)
 * @access  Private
 */
exports.initiateCardPayment = async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const { patientId, invoiceId, amount, paymentType, patientInfo } = req.body;

    const result = await paymentService.initiateCardPayment({
      patientId,
      invoiceId,
      amount,
      paymentType,
      patientInfo,
    });

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error initiating card payment:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   POST /api/payments/process-saved-card
 * @desc    Process payment with saved card (Alternative Flow A3)
 * @access  Private
 */
exports.processSavedCardPayment = async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const { patientId, invoiceId, amount, paymentType, savedCardId } = req.body;

    const result = await paymentService.processSavedCardPayment({
      patientId,
      invoiceId,
      amount,
      paymentType,
      savedCardId,
    });

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error processing saved card payment:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   POST /api/payments/confirm
 * @desc    Confirm payment after Stripe processing (Main Success Scenario - Step 11)
 * @access  Private
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required',
      });
    }

    const result = await paymentService.confirmPayment(paymentIntentId);

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   POST /api/payments/handle-failure
 * @desc    Handle payment failure (Exception Flows E1, E2, E4)
 * @access  Private
 */
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { paymentIntentId, errorCode, errorMessage } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required',
      });
    }

    const result = await paymentService.handlePaymentFailure(paymentIntentId, {
      code: errorCode,
      message: errorMessage,
    });

    res.status(200).json({
      success: false,
      message: 'Payment failed',
      data: result,
    });
  } catch (error) {
    console.error('Error handling payment failure:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   POST /api/payments/save-card
 * @desc    Save a payment method for future use
 * @access  Private
 */
exports.savePaymentMethod = async (req, res) => {
  try {
    const { patientId, paymentMethodId, customerId, cardholderName } = req.body;

    if (!patientId || !paymentMethodId || !customerId || !cardholderName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await paymentService.savePaymentMethod({
      patientId,
      paymentMethodId,
      customerId,
      cardholderName,
    });

    res.status(201).json({
      success: true,
      message: 'Payment method saved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error saving payment method:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/payments/saved-cards/:patientId
 * @desc    Get patient's saved cards
 * @access  Private
 */
exports.getSavedCards = async (req, res) => {
  try {
    const { patientId } = req.params;

    const cards = await paymentService.getSavedCards(patientId);

    res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error('Error getting saved cards:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   DELETE /api/payments/saved-cards/:cardId
 * @desc    Remove a saved card
 * @access  Private
 */
exports.removeSavedCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required',
      });
    }

    await paymentService.removeSavedCard(cardId, patientId);

    res.status(200).json({
      success: true,
      message: 'Card removed successfully',
    });
  } catch (error) {
    console.error('Error removing saved card:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/payments/invoices/:patientId
 * @desc    Get patient's invoices (Main Success Scenario - Steps 2-3)
 * @access  Private
 */
exports.getPatientInvoices = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, limit } = req.query;

    const invoices = await paymentService.getPatientInvoices(patientId, {
      status,
      limit: limit ? parseInt(limit) : undefined,
    });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    console.error('Error getting invoices:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/payments/history/:patientId
 * @desc    Get patient's payment history
 * @access  Private
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status, startDate, endDate, limit } = req.query;

    const payments = await paymentService.getPaymentHistory(patientId, {
      status,
      startDate,
      endDate,
      limit: limit ? parseInt(limit) : undefined,
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   GET /api/payments/transaction/:transactionId
 * @desc    Get payment by transaction ID
 * @access  Private
 */
exports.getPaymentByTransactionId = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const Payment = require('../models/Payment');
    const payment = await Payment.findOne({ transactionId })
      .populate('invoiceId', 'invoiceNumber totalAmount')
      .populate('patientId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (but verified by Stripe signature)
 */
exports.handleStripeWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = stripeService.verifyWebhookSignature(req.body, signature);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await paymentService.confirmPayment(event.data.object.id);
        break;
      
      case 'payment_intent.payment_failed':
        await paymentService.handlePaymentFailure(event.data.object.id, {
          code: event.data.object.last_payment_error?.code,
          message: event.data.object.last_payment_error?.message,
        });
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
