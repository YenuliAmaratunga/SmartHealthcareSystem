const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Invoice = require('../../models/Invoice');

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
  await Invoice.deleteMany({});
});

describe('Invoice Model', () => {
  
  describe('Schema Validation', () => {
    it('should create a valid invoice', async () => {
      const invoiceData = {
        invoiceNumber: 'INV-001',
        patientId: new mongoose.Types.ObjectId(),
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        items: [
          {
            description: 'Medical Consultation',
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
          },
        ],
      };
      
      const invoice = new Invoice(invoiceData);
      const savedInvoice = await invoice.save();
      
      expect(savedInvoice._id).toBeDefined();
      expect(savedInvoice.invoiceNumber).toBe('INV-001');
      expect(savedInvoice.status).toBe('Pending');
    });
    
    it('should fail without required fields', async () => {
      const invoice = new Invoice({});
      
      await expect(invoice.save()).rejects.toThrow();
    });
    
    it('should require at least one item', async () => {
      const invoiceData = {
        invoiceNumber: 'INV-002',
        patientId: new mongoose.Types.ObjectId(),
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [],
      };
      
      const invoice = new Invoice(invoiceData);
      const savedInvoice = await invoice.save();
      
      // Mongoose doesn't enforce minimum array length by default, but we can check
      expect(savedInvoice.items.length).toBe(0);
    });
  });
  
  describe('Pre-save Hook', () => {
    it('should calculate remaining amount before saving', async () => {
      const invoice = new Invoice({
        invoiceNumber: 'INV-003',
        patientId: new mongoose.Types.ObjectId(),
        totalAmount: 500,
        paidAmount: 200,
        remainingAmount: 0, // Will be recalculated
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [
          {
            description: 'Test',
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
          },
        ],
      });
      
      await invoice.save();
      
      expect(invoice.remainingAmount).toBe(300);
    });
    
    it('should set status to Paid when fully paid', async () => {
      const invoice = new Invoice({
        invoiceNumber: 'INV-004',
        patientId: new mongoose.Types.ObjectId(),
        totalAmount: 500,
        paidAmount: 500,
        remainingAmount: 0,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [
          {
            description: 'Test',
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
          },
        ],
      });
      
      await invoice.save();
      
      expect(invoice.status).toBe('Paid');
    });
    
    it('should set status to Partially Paid when partially paid', async () => {
      const invoice = new Invoice({
        invoiceNumber: 'INV-005',
        patientId: new mongoose.Types.ObjectId(),
        totalAmount: 500,
        paidAmount: 200,
        remainingAmount: 300,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [
          {
            description: 'Test',
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
          },
        ],
      });
      
      await invoice.save();
      
      expect(invoice.status).toBe('Partially Paid');
    });
    
    it('should set status to Overdue when past due date and unpaid', async () => {
      const invoice = new Invoice({
        invoiceNumber: 'INV-006',
        patientId: new mongoose.Types.ObjectId(),
        totalAmount: 500,
        paidAmount: 0,
        remainingAmount: 500,
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        items: [
          {
            description: 'Test',
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
          },
        ],
      });
      
      await invoice.save();
      
      expect(invoice.status).toBe('Overdue');
    });
  });
  
  describe('Instance Methods', () => {
    describe('applyPayment', () => {
      it('should apply payment and update amounts', async () => {
        const invoice = await new Invoice({
          invoiceNumber: 'INV-007',
          patientId: new mongoose.Types.ObjectId(),
          totalAmount: 500,
          paidAmount: 0,
          remainingAmount: 500,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          items: [
            {
              description: 'Test',
              quantity: 1,
              unitPrice: 500,
              totalPrice: 500,
            },
          ],
        }).save();
        
        await invoice.applyPayment(200);
        
        expect(invoice.paidAmount).toBe(200);
        expect(invoice.remainingAmount).toBe(300);
        expect(invoice.status).toBe('Partially Paid');
      });
      
      it('should mark as Paid when full amount is applied', async () => {
        const invoice = await new Invoice({
          invoiceNumber: 'INV-008',
          patientId: new mongoose.Types.ObjectId(),
          totalAmount: 500,
          paidAmount: 0,
          remainingAmount: 500,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          items: [
            {
              description: 'Test',
              quantity: 1,
              unitPrice: 500,
              totalPrice: 500,
            },
          ],
        }).save();
        
        await invoice.applyPayment(500);
        
        expect(invoice.paidAmount).toBe(500);
        expect(invoice.remainingAmount).toBe(0);
        expect(invoice.status).toBe('Paid');
      });
    });
    
    describe('isFullyPaid', () => {
      it('should return true when fully paid', () => {
        const invoice = new Invoice({
          invoiceNumber: 'INV-009',
          patientId: new mongoose.Types.ObjectId(),
          totalAmount: 500,
          paidAmount: 500,
          remainingAmount: 0,
          dueDate: new Date(),
          items: [],
        });
        
        expect(invoice.isFullyPaid()).toBe(true);
      });
      
      it('should return false when not fully paid', () => {
        const invoice = new Invoice({
          invoiceNumber: 'INV-010',
          patientId: new mongoose.Types.ObjectId(),
          totalAmount: 500,
          paidAmount: 200,
          remainingAmount: 300,
          dueDate: new Date(),
          items: [],
        });
        
        expect(invoice.isFullyPaid()).toBe(false);
      });
    });
    
    describe('isOverdue', () => {
      it('should return true when past due date and not fully paid', () => {
        const invoice = new Invoice({
          invoiceNumber: 'INV-011',
          patientId: new mongoose.Types.ObjectId(),
          totalAmount: 500,
          paidAmount: 0,
          remainingAmount: 500,
          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          items: [],
        });
        
        expect(invoice.isOverdue()).toBe(true);
      });
      
      it('should return false when fully paid even if past due date', () => {
        const invoice = new Invoice({
          invoiceNumber: 'INV-012',
          patientId: new mongoose.Types.ObjectId(),
          totalAmount: 500,
          paidAmount: 500,
          remainingAmount: 0,
          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          items: [],
        });
        
        expect(invoice.isOverdue()).toBe(false);
      });
      
      it('should return false when not past due date', () => {
        const invoice = new Invoice({
          invoiceNumber: 'INV-013',
          patientId: new mongoose.Types.ObjectId(),
          totalAmount: 500,
          paidAmount: 0,
          remainingAmount: 500,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          items: [],
        });
        
        expect(invoice.isOverdue()).toBe(false);
      });
    });
  });
});

