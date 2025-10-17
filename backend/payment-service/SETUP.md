# Payment Service Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend/payment-service
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root of payment-service directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/healthcare_payments

# Server Configuration
PORT=5003
NODE_ENV=development

# Stripe Configuration (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Other Service URLs
PATIENT_SERVICE_URL=http://localhost:5001
APPOINTMENT_SERVICE_URL=http://localhost:5002
```

### 3. Get Stripe API Keys
1. Create a free Stripe account at https://stripe.com
2. Go to **Developers** → **API Keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)
5. Add these to your `.env` file

### 4. Start the Service
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The service will run on **http://localhost:5003**

### 5. Run Tests
```bash
# Run all tests with coverage
npm test

# Watch mode for development
npm run test:watch
```

## 📋 API Endpoints

### Invoices
- `GET /api/payments/invoices/:patientId` - Get patient's invoices

### Payment Processing
- `POST /api/payments/initiate-card-payment` - Start card payment
- `POST /api/payments/process-saved-card` - Pay with saved card
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/handle-failure` - Handle payment failure

### Saved Cards
- `GET /api/payments/saved-cards/:patientId` - Get saved cards
- `POST /api/payments/save-card` - Save new card
- `DELETE /api/payments/saved-cards/:cardId` - Remove saved card

### Payment History
- `GET /api/payments/history/:patientId` - Get payment history
- `GET /api/payments/transaction/:transactionId` - Get specific transaction

### Webhooks
- `POST /api/payments/webhook` - Stripe webhook handler

## 🧪 Testing

The service includes comprehensive unit tests with 80%+ coverage:

```bash
npm test
```

Test coverage includes:
- ✅ All models (Payment, Invoice, SavedCard)
- ✅ Payment service business logic
- ✅ Stripe integration
- ✅ Error handling scenarios
- ✅ Edge cases

## 🏗️ Architecture

The service follows **SOLID principles** and clean architecture:

```
src/
├── models/           # Mongoose schemas
│   ├── Payment.js
│   ├── Invoice.js
│   └── SavedCard.js
├── services/         # Business logic layer
│   ├── paymentService.js
│   ├── stripeService.js
│   └── notificationService.js
├── controllers/      # HTTP request handlers
│   └── paymentController.js
├── routes/           # API routes
│   └── paymentRoutes.js
└── __tests__/        # Unit tests
    ├── models/
    └── services/
```

## 📝 Use Case Coverage

This implementation covers all scenarios from UC-003:

### Main Success Scenario
1. ✅ Patient navigates to "My Bills and Payments"
2. ✅ System fetches and displays invoices
3. ✅ Patient selects invoice and makes payment
4. ✅ System validates and processes payment
5. ✅ Confirmation sent to patient

### Alternative Flows
- ✅ A1: Partial Payment
- ✅ A2: Insurance Payment (Removed as per requirements)
- ✅ A3: Saved Card Payment
- ✅ A4: Retry on Payment Failure

### Exception Flows
- ✅ E1: Invalid Card Details
- ✅ E2: Insufficient Funds
- ✅ E3: Insurance Claim Denied (N/A)
- ✅ E4: Payment Gateway Timeout/Failure

## 🔒 Security

- ✅ No sensitive card data stored (uses Stripe tokens)
- ✅ PCI DSS compliant (handled by Stripe)
- ✅ Webhook signature verification
- ✅ Input validation on all endpoints
- ✅ Secure payment intent flow

## 📚 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `stripe` - Payment processing
- `joi` - Input validation
- `axios` - HTTP client
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Development
- `jest` - Testing framework
- `supertest` - HTTP testing
- `mongodb-memory-server` - In-memory database for tests
- `nodemon` - Auto-reload

## 🎯 Next Steps

1. Set up Stripe account and add API keys
2. Run tests to ensure everything works
3. Start the service
4. Test with the frontend application

## 💡 Tips

- Use Stripe test mode for development
- Test card numbers: `4242 4242 4242 4242` (Visa)
- Monitor Stripe Dashboard for payment activities
- Check logs for detailed debugging information

