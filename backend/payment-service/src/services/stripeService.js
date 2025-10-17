const Stripe = require('stripe');

// Validate that Stripe key is present
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ ERROR: STRIPE_SECRET_KEY is not set in environment variables!');
  console.error('Please check your .env file');
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
console.log('✅ Stripe initialized with key:', process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...');

/**
 * Stripe Service
 * Handles all Stripe payment gateway interactions
 * Following SOLID principles - Single Responsibility Principle
 */
class StripeService {
  
  /**
   * Create or retrieve Stripe customer for a patient
   * @param {Object} patientData - Patient information
   * @returns {Promise<string>} Stripe customer ID
   */
  async createOrGetCustomer(patientData) {
    try {
      const { patientId, email, name, phone } = patientData;
      
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0].id;
      }
      
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        phone,
        metadata: {
          patientId: patientId.toString(),
        },
      });
      
      return customer.id;
    } catch (error) {
      throw new Error(`Stripe customer creation failed: ${error.message}`);
    }
  }
  
  /**
   * Create a payment intent for card payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment intent details
   */
  async createPaymentIntent(paymentData) {
    try {
      const { amount, currency = 'usd', customerId, description, metadata } = paymentData;
      
      // Convert amount to cents (Stripe requires smallest currency unit)
      const amountInCents = Math.round(amount * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        customer: customerId,
        description,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }
  
  /**
   * Create payment intent with saved payment method
   * @param {Object} paymentData - Payment details with payment method
   * @returns {Promise<Object>} Payment intent details
   */
  async createPaymentIntentWithSavedCard(paymentData) {
    try {
      const { amount, currency = 'usd', customerId, paymentMethodId, description, metadata } = paymentData;
      
      const amountInCents = Math.round(amount * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        customer: customerId,
        payment_method: paymentMethodId,
        confirm: true, // Auto-confirm for saved cards
        description,
        metadata,
        return_url: process.env.FRONTEND_URL || 'http://localhost:5173',
      });
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      throw new Error(`Payment with saved card failed: ${error.message}`);
    }
  }
  
  /**
   * Confirm a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Updated payment intent
   */
  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert back to dollars
      };
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }
  
  /**
   * Retrieve payment intent details
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment intent details
   */
  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        paymentMethod: paymentIntent.payment_method,
      };
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }
  
  /**
   * Save payment method for future use
   * @param {Object} cardData - Card and customer data
   * @returns {Promise<Object>} Payment method details
   */
  async savePaymentMethod(cardData) {
    try {
      const { paymentMethodId, customerId } = cardData;
      
      // Attach payment method to customer
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      
      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      
      return {
        id: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expiryMonth: paymentMethod.card.exp_month,
        expiryYear: paymentMethod.card.exp_year,
      };
    } catch (error) {
      throw new Error(`Failed to save payment method: ${error.message}`);
    }
  }
  
  /**
   * Detach (remove) a payment method
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<boolean>} Success status
   */
  async removePaymentMethod(paymentMethodId) {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
      return true;
    } catch (error) {
      throw new Error(`Failed to remove payment method: ${error.message}`);
    }
  }
  
  /**
   * List all payment methods for a customer
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<Array>} List of payment methods
   */
  async listPaymentMethods(customerId) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      
      return paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expiryMonth: pm.card.exp_month,
        expiryYear: pm.card.exp_year,
      }));
    } catch (error) {
      throw new Error(`Failed to list payment methods: ${error.message}`);
    }
  }
  
  /**
   * Cancel a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Cancelled payment intent
   */
  async cancelPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      throw new Error(`Failed to cancel payment: ${error.message}`);
    }
  }
  
  /**
   * Create a refund for a payment
   * @param {Object} refundData - Refund details
   * @returns {Promise<Object>} Refund details
   */
  async createRefund(refundData) {
    try {
      const { paymentIntentId, amount, reason } = refundData;
      
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
        reason: reason || 'requested_by_customer',
      });
      
      return {
        id: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
      };
    } catch (error) {
      throw new Error(`Refund failed: ${error.message}`);
    }
  }
  
  /**
   * Verify webhook signature
   * @param {string} payload - Request body
   * @param {string} signature - Stripe signature header
   * @returns {Object} Verified event
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return event;
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }
}

module.exports = new StripeService();

