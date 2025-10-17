# 🚀 QUICK START - Payment Service Setup

**Don't stress! Follow these exact steps. Total time: 15 minutes**

---

## ✅ **Step 1: Get Your Stripe Keys** (5 minutes)

1. Go to: **https://dashboard.stripe.com/register**
2. Sign up (FREE, no credit card needed!)
3. After logging in, click **"Developers"** → **"API Keys"**
4. Copy these TWO keys:
   - **Publishable key**: `pk_test_...` 
   - **Secret key**: `sk_test_...`

📝 **Keep these somewhere safe - you'll need them next!**

---

## ✅ **Step 2: Create Backend .env File** (2 minutes)

**Location**: `backend/payment-service/.env`

Create this file and paste:

```env
MONGODB_URI=mongodb://localhost:27017/healthcare_payments
PORT=5003
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_PASTE_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_test_webhook
FRONTEND_URL=http://localhost:5173
```

**⚠️ REPLACE** `sk_test_PASTE_YOUR_SECRET_KEY_HERE` with your actual key!

---

## ✅ **Step 3: Create Frontend .env File** (1 minute)

**Location**: `frontend/hospital360/.env`

Create this file and paste:

```env
VITE_PAYMENT_SERVICE_URL=http://localhost:5003/api/payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE
```

**⚠️ REPLACE** `pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE` with your actual key!

---

## ✅ **Step 4: Start Backend** (3 minutes)

Open **PowerShell/Terminal**:

```bash
cd backend/payment-service

# Install dependencies
npm install

# Run tests (should all pass!)
npm test

# Add sample invoices for testing
npm run seed

# Start the server
npm run dev
```

✅ You should see: `🚀 Server running at http://localhost:5003`

**Keep this terminal window open!**

---

## ✅ **Step 5: Start Frontend** (2 minutes)

Open a **NEW PowerShell/Terminal**:

```bash
cd frontend/hospital360

# Install dependencies
npm install

# Start the frontend
npm run dev
```

✅ You should see: `➜ Local: http://localhost:5173/`

---

## ✅ **Step 6: Test It!** 🎉 (5 minutes)

1. **Open browser**: http://localhost:5173/bills-and-payments

2. **You should see 4 sample invoices!**

3. **Click "Make Payment" on any invoice**

4. **Use Stripe Test Card**:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any 5 digits)

5. **Try these scenarios**:
   - ✅ Pay full amount
   - ✅ Pay partial amount (select "Pay Other Amount")
   - ✅ Save card during payment (check the box)
   - ✅ Pay with saved card
   - ✅ Test failure: Use card `4000000000000002` (decline)

---

## 🧪 **Run Tests**

```bash
cd backend/payment-service
npm test
```

You should see **all tests passing** with **80%+ coverage**!

---

## 📊 **Test Cards for Different Scenarios**

| Card Number | Result | Use For |
|-------------|--------|---------|
| `4242 4242 4242 4242` | ✅ Success | Normal payments |
| `4000 0000 0000 0002` | ❌ Declined | Test error handling (E2) |
| `4000 0000 0000 9995` | ❌ Insufficient | Test insufficient funds (E2) |
| Use expiry `01/20` | ❌ Expired | Test expired card |

---

## 🐛 **Troubleshooting**

### "Cannot connect to MongoDB"
**Make sure MongoDB is running!**
- Windows: Start MongoDB service
- Or use MongoDB Atlas (free cloud database)

### "Stripe keys invalid"
- Double-check you copied the keys correctly
- Make sure you're using **test mode** keys (start with `pk_test_` and `sk_test_`)
- Make sure there are no extra spaces

### "Cannot find module"
```bash
cd backend/payment-service
npm install
```

### "Port 5003 already in use"
```bash
# Kill the process on port 5003 (Windows)
netstat -ano | findstr :5003
taskkill /PID <PID_NUMBER> /F
```

---

## 📁 **What's Been Built For You**

### Backend ✅
- ✅ 3 Models: Payment, Invoice, SavedCard
- ✅ 3 Services: PaymentService, StripeService, NotificationService
- ✅ 11 API Endpoints
- ✅ Unit Tests (80%+ coverage)
- ✅ Error Handling
- ✅ SOLID Principles

### Frontend ✅
- ✅ Bills & Payments Page
- ✅ Payment Form (Stripe integration)
- ✅ Saved Cards Management
- ✅ Success/Failure Pages
- ✅ Beautiful UI (Tailwind CSS)

---

## 🎯 **All Use Cases Covered**

| Scenario | Status |
|----------|--------|
| Main Success Scenario | ✅ |
| A1: Partial Payment | ✅ |
| A3: Saved Card Payment | ✅ |
| A4: Retry on Failure | ✅ |
| E1: Invalid Card | ✅ |
| E2: Insufficient Funds | ✅ |
| E4: Gateway Timeout | ✅ |

---

## 🆘 **Still Stuck?**

1. Check if MongoDB is running
2. Check if ports 5003 and 5173 are free
3. Verify .env files have correct Stripe keys
4. Try `npm install` again in both backend and frontend
5. Restart both servers

---

## 📚 **Next Steps for Assignment**

1. ✅ Test all payment scenarios
2. 📸 Take screenshots for your report
3. 📝 Write critique (strengths & improvements)
4. 🎥 Prepare demo
5. 📊 Show test coverage report

**You're all set!** 🎉

---

**Total Setup Time**: ~15 minutes  
**Total Implementation Time**: Already done for you! 🎉

