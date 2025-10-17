/**
 * Seed Test Data Script
 * Creates sample invoices for testing the payment system
 * Run this after starting your backend server
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Define schemas inline (since we're outside the app)
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  patientId: mongoose.Schema.Types.ObjectId,
  totalAmount: Number,
  paidAmount: Number,
  remainingAmount: Number,
  status: String,
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
  }],
  issueDate: Date,
  dueDate: Date,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Sample patient ID (you can change this)
const SAMPLE_PATIENT_ID = '507f1f77bcf86cd799439011';

const sampleInvoices = [
  {
    invoiceNumber: 'INV-2024-001',
    patientId: SAMPLE_PATIENT_ID,
    totalAmount: 500.00,
    paidAmount: 0,
    remainingAmount: 500.00,
    status: 'Pending',
    items: [
      {
        description: 'Medical Consultation',
        quantity: 1,
        unitPrice: 500.00,
        totalPrice: 500.00,
      },
    ],
    issueDate: new Date('2024-10-01'),
    dueDate: new Date('2024-11-01'),
  },
  {
    invoiceNumber: 'INV-2024-002',
    patientId: SAMPLE_PATIENT_ID,
    totalAmount: 1250.00,
    paidAmount: 0,
    remainingAmount: 1250.00,
    status: 'Pending',
    items: [
      {
        description: 'Laboratory Tests',
        quantity: 3,
        unitPrice: 150.00,
        totalPrice: 450.00,
      },
      {
        description: 'X-Ray Examination',
        quantity: 1,
        unitPrice: 800.00,
        totalPrice: 800.00,
      },
    ],
    issueDate: new Date('2024-10-05'),
    dueDate: new Date('2024-11-05'),
  },
  {
    invoiceNumber: 'INV-2024-003',
    patientId: SAMPLE_PATIENT_ID,
    totalAmount: 3500.00,
    paidAmount: 1000.00,
    remainingAmount: 2500.00,
    status: 'Partially Paid',
    items: [
      {
        description: 'Surgery - Appendectomy',
        quantity: 1,
        unitPrice: 3500.00,
        totalPrice: 3500.00,
      },
    ],
    issueDate: new Date('2024-09-15'),
    dueDate: new Date('2024-10-15'),
  },
  {
    invoiceNumber: 'INV-2024-004',
    patientId: SAMPLE_PATIENT_ID,
    totalAmount: 200.00,
    paidAmount: 0,
    remainingAmount: 200.00,
    status: 'Overdue',
    items: [
      {
        description: 'Prescription Medications',
        quantity: 1,
        unitPrice: 200.00,
        totalPrice: 200.00,
      },
    ],
    issueDate: new Date('2024-08-01'),
    dueDate: new Date('2024-09-01'), // Past due
  },
];

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing invoices...');
    await Invoice.deleteMany({ patientId: SAMPLE_PATIENT_ID });
    console.log('✅ Cleared existing data');

    console.log('📝 Creating sample invoices...');
    const createdInvoices = await Invoice.insertMany(sampleInvoices);
    console.log(`✅ Created ${createdInvoices.length} sample invoices`);

    console.log('\n📋 Sample Invoices Created:');
    createdInvoices.forEach(inv => {
      console.log(`   - ${inv.invoiceNumber}: $${inv.totalAmount} (${inv.status})`);
    });

    console.log('\n🎉 Test data seeded successfully!');
    console.log(`\n💡 Use Patient ID: ${SAMPLE_PATIENT_ID} for testing`);
    console.log('   This ID is already set in localStorage by default\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

