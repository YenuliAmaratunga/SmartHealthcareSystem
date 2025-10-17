const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const paymentService = require('../../services/paymentService');
const Payment = require('../../models/Payment');
const Invoice = require('../../models/Invoice');
const SavedCard = require('../../models/SavedCard');
const stripeService = require('../../services/stripeService');

// Mock Stripe service
jest.mock('../../services/stripeService');
jest.mock('../../services/notificationService');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Payment.deleteMany({});
  await Invoice.deleteMany({});
  await SavedCard.deleteMany({});
  jest.clearAllMocks();
});

describe('PaymentService', () => {
  
  describe('initiateCardPayment', () => {
    it('should successfully initiate a card payment', async () => {
      const patientId = new mongoose.Types.ObjectId();
      const invoiceId = new mongoose.Types.ObjectId();
      
      // Create test invoice
      const invoice = await new Invoice({
        invoiceNumber: 'INV-TEST-001',
        patientId,
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      // Mock Stripe responses
      stripeService.createOrGetCustomer.mockResolvedValue('cus_test123');
      stripeService.createPaymentIntent.mockResolvedValue({
        clientSecret: 'pi_test_secret',
        paymentIntentId: 'pi_test123',
      });
      
      const result = await paymentService.initiateCardPayment({
        patientId: patientId.toString(),
        invoiceId: invoiceId.toString(),
        amount: 500,
        paymentType: 'Full',
        patientInfo: {
          email: 'test@example.com',
          name: 'Test Patient',
          phone: '1234567890',
        },
      });
      
      expect(result).toHaveProperty('paymentId');
      expect(result).toHaveProperty('transactionId');
      expect(result).toHaveProperty('clientSecret', 'pi_test_secret');
      expect(result.amount).toBe(500);
      expect(stripeService.createOrGetCustomer).toHaveBeenCalled();
      expect(stripeService.createPaymentIntent).toHaveBeenCalled();
    });
    
    it('should reject payment amount greater than remaining balance', async () => {
      const patientId = new mongoose.Types.ObjectId();
      const invoiceId = new mongoose.Types.ObjectId();
      
      await new Invoice({
        invoiceNumber: 'INV-TEST-002',
        patientId,
        totalAmount: 500,
        paidAmount: 200,
        remainingAmount: 300,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      await expect(paymentService.initiateCardPayment({
        patientId: patientId.toString(),
        invoiceId: invoiceId.toString(),
        amount: 400, // More than remaining balance
        paymentType: 'Partial',
        patientInfo: {
          email: 'test@example.com',
          name: 'Test Patient',
        },
      })).rejects.toThrow('Payment amount exceeds remaining balance');
    });
    
    it('should reject payment for non-existent invoice', async () => {
      const patientId = new mongoose.Types.ObjectId();
      const fakeInvoiceId = new mongoose.Types.ObjectId();
      
      await expect(paymentService.initiateCardPayment({
        patientId: patientId.toString(),
        invoiceId: fakeInvoiceId.toString(),
        amount: 500,
        paymentType: 'Full',
        patientInfo: {
          email: 'test@example.com',
          name: 'Test Patient',
        },
      })).rejects.toThrow();
    });
  });
  
  describe('processSavedCardPayment', () => {
    it('should successfully process payment with saved card', async () => {
      const patientId = new mongoose.Types.ObjectId();
      const invoiceId = new mongoose.Types.ObjectId();
      
      const invoice = await new Invoice({
        invoiceNumber: 'INV-TEST-003',
        patientId,
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      const savedCard = await new SavedCard({
        patientId,
        stripeCustomerId: 'cus_test123',
        stripePaymentMethodId: 'pm_test123',
        cardBrand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        cardholderName: 'Test Patient',
        isDefault: true,
        isActive: true,
      }).save();
      
      stripeService.createPaymentIntentWithSavedCard.mockResolvedValue({
        paymentIntentId: 'pi_test123',
        status: 'succeeded',
      });
      
      const result = await paymentService.processSavedCardPayment({
        patientId: patientId.toString(),
        invoiceId: invoiceId.toString(),
        amount: 500,
        paymentType: 'Full',
        savedCardId: savedCard._id.toString(),
      });
      
      expect(result).toHaveProperty('paymentId');
      expect(result).toHaveProperty('transactionId');
      expect(result.status).toBe('Completed');
      expect(stripeService.createPaymentIntentWithSavedCard).toHaveBeenCalled();
    });
    
    it('should reject payment with expired card', async () => {
      const patientId = new mongoose.Types.ObjectId();
      const invoiceId = new mongoose.Types.ObjectId();
      
      await new Invoice({
        invoiceNumber: 'INV-TEST-004',
        patientId,
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      const expiredCard = await new SavedCard({
        patientId,
        stripeCustomerId: 'cus_test123',
        stripePaymentMethodId: 'pm_test123',
        cardBrand: 'visa',
        last4: '4242',
        expiryMonth: 1,
        expiryYear: 2020, // Expired
        cardholderName: 'Test Patient',
        isDefault: true,
        isActive: true,
      }).save();
      
      await expect(paymentService.processSavedCardPayment({
        patientId: patientId.toString(),
        invoiceId: invoiceId.toString(),
        amount: 500,
        paymentType: 'Full',
        savedCardId: expiredCard._id.toString(),
      })).rejects.toThrow('Card has expired');
    });
  });
  
  describe('confirmPayment', () => {
    it('should confirm payment and update invoice', async () => {
      const patientId = new mongoose.Types.ObjectId();
      const invoiceId = new mongoose.Types.ObjectId();
      
      const invoice = await new Invoice({
        invoiceNumber: 'INV-TEST-005',
        patientId,
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      const payment = await new Payment({
        patientId,
        invoiceId,
        amount: 500,
        paymentType: 'Full',
        paymentMethod: 'Card',
        status: 'Processing',
        stripePaymentIntentId: 'pi_test123',
      }).save();
      
      stripeService.retrievePaymentIntent.mockResolvedValue({
        id: 'pi_test123',
        status: 'succeeded',
        amount: 500,
      });
      
      const result = await paymentService.confirmPayment('pi_test123');
      
      expect(result.success).toBe(true);
      expect(result.status).toBe('Completed');
      
      const updatedInvoice = await Invoice.findById(invoiceId);
      expect(updatedInvoice.paidAmount).toBe(500);
      expect(updatedInvoice.status).toBe('Paid');
    });
  });
  
  describe('handlePaymentFailure', () => {
    it('should mark payment as failed with error details', async () => {
      const payment = await new Payment({
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: 500,
        paymentType: 'Full',
        paymentMethod: 'Card',
        status: 'Processing',
        stripePaymentIntentId: 'pi_test123',
      }).save();
      
      const result = await paymentService.handlePaymentFailure('pi_test123', {
        code: 'card_declined',
        message: 'Insufficient funds',
      });
      
      expect(result.success).toBe(false);
      expect(result.canRetry).toBe(true);
      
      const updatedPayment = await Payment.findById(payment._id);
      expect(updatedPayment.status).toBe('Failed');
      expect(updatedPayment.failureReason).toBe('card_declined');
      expect(updatedPayment.retryCount).toBe(1);
    });
  });
  
  describe('validateInvoice', () => {
    it('should reject payment for fully paid invoice', async () => {
      const patientId = new mongoose.Types.ObjectId();
      
      const invoice = await new Invoice({
        invoiceNumber: 'INV-TEST-006',
        patientId,
        totalAmount: 500,
        paidAmount: 500,
        remainingAmount: 0,
        status: 'Paid',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      await expect(paymentService.validateInvoice(
        invoice._id.toString(),
        patientId.toString(),
        100,
        'Partial'
      )).rejects.toThrow('Invoice is already fully paid');
    });
    
    it('should reject zero or negative payment amount', async () => {
      const patientId = new mongoose.Types.ObjectId();
      
      const invoice = await new Invoice({
        invoiceNumber: 'INV-TEST-007',
        patientId,
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      await expect(paymentService.validateInvoice(
        invoice._id.toString(),
        patientId.toString(),
        0,
        'Partial'
      )).rejects.toThrow('Payment amount must be greater than zero');
    });
  });
  
  describe('getPatientInvoices', () => {
    it('should return all invoices for a patient', async () => {
      const patientId = new mongoose.Types.ObjectId();
      
      await new Invoice({
        invoiceNumber: 'INV-TEST-008',
        patientId,
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service 1',
          quantity: 1,
          unitPrice: 500,
          totalPrice: 500,
        }],
      }).save();
      
      await new Invoice({
        invoiceNumber: 'INV-TEST-009',
        patientId,
        totalAmount: 300,
        paidAmount: 0,
        remainingAmount: 300,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [{
          description: 'Test Service 2',
          quantity: 1,
          unitPrice: 300,
          totalPrice: 300,
        }],
      }).save();
      
      const invoices = await paymentService.getPatientInvoices(patientId.toString());
      
      expect(invoices).toHaveLength(2);
      expect(invoices[0]).toHaveProperty('invoiceNumber');
      expect(invoices[0]).toHaveProperty('remainingAmount');
    });
  });
});

