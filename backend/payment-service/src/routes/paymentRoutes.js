const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * Payment Routes
 * Maps HTTP endpoints to controller functions
 */

// ============ Invoice Management ============
// @route   GET /api/payments/invoices/:patientId
// @desc    Get patient's outstanding invoices
router.get('/invoices/:patientId', paymentController.getPatientInvoices);

// ============ Payment Processing ============
// @route   POST /api/payments/initiate-card-payment
// @desc    Initiate a new card payment
router.post('/initiate-card-payment', paymentController.initiateCardPayment);

// @route   POST /api/payments/process-saved-card
// @desc    Process payment with saved card
router.post('/process-saved-card', paymentController.processSavedCardPayment);

// @route   POST /api/payments/confirm
// @desc    Confirm payment after Stripe processing
router.post('/confirm', paymentController.confirmPayment);

// @route   POST /api/payments/handle-failure
// @desc    Handle payment failure
router.post('/handle-failure', paymentController.handlePaymentFailure);

// ============ Saved Cards Management ============
// @route   POST /api/payments/save-card
// @desc    Save a payment method for future use
router.post('/save-card', paymentController.savePaymentMethod);

// @route   GET /api/payments/saved-cards/:patientId
// @desc    Get patient's saved cards
router.get('/saved-cards/:patientId', paymentController.getSavedCards);

// @route   DELETE /api/payments/saved-cards/:cardId
// @desc    Remove a saved card
router.delete('/saved-cards/:cardId', paymentController.removeSavedCard);

// ============ Payment History ============
// @route   GET /api/payments/history/:patientId
// @desc    Get patient's payment history
router.get('/history/:patientId', paymentController.getPaymentHistory);

// @route   GET /api/payments/transaction/:transactionId
// @desc    Get payment by transaction ID
router.get('/transaction/:transactionId', paymentController.getPaymentByTransactionId);

// ============ Webhooks ============
// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;
