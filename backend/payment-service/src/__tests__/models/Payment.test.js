const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Payment = require('../../models/Payment');

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
});

describe('Payment Model', () => {
  
  describe('Schema Validation', () => {
    it('should create a valid payment', async () => {
      const paymentData = {
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: 100.50,
        paymentType: 'Full',
        paymentMethod: 'Card',
        status: 'Pending',
      };
      
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      
      expect(savedPayment._id).toBeDefined();
      expect(savedPayment.amount).toBe(100.50);
      expect(savedPayment.transactionId).toBeDefined();
      expect(savedPayment.transactionId).toMatch(/^TXN-/);
    });
    
    it('should fail without required fields', async () => {
      const payment = new Payment({});
      
      await expect(payment.save()).rejects.toThrow();
    });
    
    it('should only accept valid payment types', async () => {
      const paymentData = {
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: 100,
        paymentType: 'Invalid',
        paymentMethod: 'Card',
      };
      
      const payment = new Payment(paymentData);
      
      await expect(payment.save()).rejects.toThrow();
    });
    
    it('should only accept valid payment methods', async () => {
      const paymentData = {
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: 100,
        paymentType: 'Full',
        paymentMethod: 'Bitcoin', // Invalid
      };
      
      const payment = new Payment(paymentData);
      
      await expect(payment.save()).rejects.toThrow();
    });
    
    it('should not accept negative amounts', async () => {
      const paymentData = {
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: -50,
        paymentType: 'Full',
        paymentMethod: 'Card',
      };
      
      const payment = new Payment(paymentData);
      
      await expect(payment.save()).rejects.toThrow();
    });
  });
  
  describe('Transaction ID Generation', () => {
    it('should automatically generate a unique transaction ID', async () => {
      const paymentData = {
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: 100,
        paymentType: 'Full',
        paymentMethod: 'Card',
      };
      
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      
      expect(savedPayment.transactionId).toBeDefined();
      expect(savedPayment.transactionId).toMatch(/^TXN-\d+-[A-Z0-9]+$/);
    });
    
    it('should generate unique transaction IDs for multiple payments', async () => {
      const payment1Data = {
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: 100,
        paymentType: 'Full',
        paymentMethod: 'Card',
      };
      
      const payment2Data = {
        patientId: new mongoose.Types.ObjectId(),
        invoiceId: new mongoose.Types.ObjectId(),
        amount: 200,
        paymentType: 'Partial',
        paymentMethod: 'SavedCard',
      };
      
      const payment1 = await new Payment(payment1Data).save();
      const payment2 = await new Payment(payment2Data).save();
      
      expect(payment1.transactionId).not.toBe(payment2.transactionId);
    });
  });
  
  describe('Payment Methods', () => {
    describe('markCompleted', () => {
      it('should mark payment as completed with payment date', async () => {
        const payment = await new Payment({
          patientId: new mongoose.Types.ObjectId(),
          invoiceId: new mongoose.Types.ObjectId(),
          amount: 100,
          paymentType: 'Full',
          paymentMethod: 'Card',
          status: 'Pending',
        }).save();
        
        const paymentIntentId = 'pi_test123';
        await payment.markCompleted(paymentIntentId);
        
        expect(payment.status).toBe('Completed');
        expect(payment.paymentDate).toBeDefined();
        expect(payment.stripePaymentIntentId).toBe(paymentIntentId);
      });
    });
    
    describe('markFailed', () => {
      it('should mark payment as failed with reason and increment retry count', async () => {
        const payment = await new Payment({
          patientId: new mongoose.Types.ObjectId(),
          invoiceId: new mongoose.Types.ObjectId(),
          amount: 100,
          paymentType: 'Full',
          paymentMethod: 'Card',
          status: 'Pending',
        }).save();
        
        await payment.markFailed('card_declined', 'Insufficient funds');
        
        expect(payment.status).toBe('Failed');
        expect(payment.failureReason).toBe('card_declined');
        expect(payment.failureMessage).toBe('Insufficient funds');
        expect(payment.retryCount).toBe(1);
      });
      
      it('should increment retry count on multiple failures', async () => {
        const payment = await new Payment({
          patientId: new mongoose.Types.ObjectId(),
          invoiceId: new mongoose.Types.ObjectId(),
          amount: 100,
          paymentType: 'Full',
          paymentMethod: 'Card',
          status: 'Pending',
        }).save();
        
        await payment.markFailed('error1', 'First failure');
        expect(payment.retryCount).toBe(1);
        
        await payment.markFailed('error2', 'Second failure');
        expect(payment.retryCount).toBe(2);
      });
    });
    
    describe('canRetry', () => {
      it('should return true if payment failed and retry count < 3', () => {
        const payment = new Payment({
          patientId: new mongoose.Types.ObjectId(),
          invoiceId: new mongoose.Types.ObjectId(),
          amount: 100,
          paymentType: 'Full',
          paymentMethod: 'Card',
          status: 'Failed',
          retryCount: 2,
        });
        
        expect(payment.canRetry()).toBe(true);
      });
      
      it('should return false if retry count >= 3', () => {
        const payment = new Payment({
          patientId: new mongoose.Types.ObjectId(),
          invoiceId: new mongoose.Types.ObjectId(),
          amount: 100,
          paymentType: 'Full',
          paymentMethod: 'Card',
          status: 'Failed',
          retryCount: 3,
        });
        
        expect(payment.canRetry()).toBe(false);
      });
      
      it('should return false if payment is not failed', () => {
        const payment = new Payment({
          patientId: new mongoose.Types.ObjectId(),
          invoiceId: new mongoose.Types.ObjectId(),
          amount: 100,
          paymentType: 'Full',
          paymentMethod: 'Card',
          status: 'Completed',
          retryCount: 1,
        });
        
        expect(payment.canRetry()).toBe(false);
      });
    });
  });
});

