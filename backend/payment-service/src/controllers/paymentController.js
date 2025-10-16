const Payment = require('../models/Payment');

// Create a new payment record
exports.createPayment = async (req, res) => {
  try {
    const { patientId, billId, amountPaid, paymentMethod, status, stripePaymentIntentId } = req.body;

    const newPayment = new Payment({
      patientId,
      billId,
      amountPaid,
      paymentMethod,
      status: status || 'Pending',
      stripePaymentIntentId,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: 'Server error creating payment', error });
  }
};

// Get all payments (optionally filter by patientId)
exports.getPayments = async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = patientId ? { patientId } : {};

    const payments = await Payment.find(filter)
      .populate('patientId', 'name dob contact') // populate patient with selected fields
      .populate('billId'); // populate bill details if needed

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: 'Server error fetching payments', error });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('patientId', 'name dob contact')
      .populate('billId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: 'Server error fetching payment', error });
  }
};

// Update payment status (e.g., after Stripe webhook confirms payment success)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    await payment.save();

    res.json(payment);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: 'Server error updating payment', error });
  }
};

// Optionally: delete payment (if your app allows)
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: 'Server error deleting payment', error });
  }
};
