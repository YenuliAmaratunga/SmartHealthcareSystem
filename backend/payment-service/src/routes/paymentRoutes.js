const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// @route   POST /api/payments
// @desc    Create a new payment
router.post('/', paymentController.createPayment);

// @route   GET /api/payments
// @desc    Get all payments or filter by patientId
router.get('/', paymentController.getPayments);

// @route   GET /api/payments/:id
// @desc    Get a payment by ID
router.get('/:id', paymentController.getPaymentById);

// @route   PATCH /api/payments/:id/status
// @desc    Update payment status (e.g., after Stripe success)
router.patch('/:id/status', paymentController.updatePaymentStatus);

// @route   DELETE /api/payments/:id
// @desc    Delete a payment (optional)
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
