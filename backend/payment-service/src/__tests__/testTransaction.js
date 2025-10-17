require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Payment = require('../models/Payment');

async function testTransactionId() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('✅ MONGODB_URI from .env:', process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // ✅ Wait for DB connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create payment document
    const payment = new Payment({
      patientId: new mongoose.Types.ObjectId(),
      invoiceId: new mongoose.Types.ObjectId(),
      amount: 123.45,
      paymentType: 'Full',
      paymentMethod: 'Card',
    });

    // Save to DB — should trigger pre('save') and generate transactionId
    await payment.save();

    // Output transactionId
    console.log('🆔 Generated transactionId:', payment.transactionId);

    // Close DB connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testTransactionId();
