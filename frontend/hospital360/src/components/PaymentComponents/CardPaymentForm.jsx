import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { confirmPayment, savePaymentMethod } from '../../api/paymentapi';
import { FaSave } from 'react-icons/fa';

/**
 * Card Payment Form (with Stripe Elements)
 * Integrates with Stripe Elements for secure card input
 * Implements UC-003 Steps 8-10 (Card Payment)
 */
const CardPaymentFormWithStripe = ({ invoice, amount, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [saveCard, setSaveCard] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-processing',
        },
        redirect: 'if_required', // Only redirect if required by payment method
      });
      
      if (stripeError) {
        // Payment failed
        setError(stripeError.message);
        
        // Navigate to failure page
        navigate('/payment-failure', {
          state: {
            error: stripeError.message,
            invoice,
            canRetry: true,
          },
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        // Confirm with backend
        const confirmation = await confirmPayment(paymentIntent.id);
        
        // Optional: Save payment method if user requested
        if (saveCard && paymentIntent.payment_method) {
          try {
            const patientId = localStorage.getItem('patientId') || '507f1f77bcf86cd799439011';
            await savePaymentMethod({
              patientId,
              paymentMethodId: paymentIntent.payment_method,
              customerId: paymentIntent.customer,
              cardholderName: 'Card Holder', // You might want to collect this separately
            });
          } catch (saveError) {
            console.error('Failed to save card:', saveError);
            // Don't fail the whole payment if card saving fails
          }
        }
        
        // Navigate to success page
        navigate('/payment-success', {
          state: {
            transaction: confirmation.data,
            invoice,
            amount,
          },
        });
      } else {
        // Handle other statuses (requires_action, processing, etc.)
        setError('Payment is being processed. Please wait...');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };
  
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amt);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element - Only render when we have elements */}
      {stripe && elements && (
        <div className="p-4 border border-gray-300 rounded-lg">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>
      )}
      
      {/* Save Card Option */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <span className="text-sm text-gray-700 flex items-center gap-1">
          <FaSave className="text-blue-600" />
          Save this card for future payments
        </span>
      </label>
      
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </span>
        ) : (
          `Pay ${formatCurrency(amount)}`
        )}
      </button>
      
      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center">
        By completing this payment, you agree to the terms and conditions
      </p>
    </form>
  );
};

/**
 * Card Payment Form Wrapper
 * Handles initiation and Stripe Elements rendering
 */
const CardPaymentForm = ({ invoice, amount, onInitiatePayment, clientSecret, loading: parentLoading }) => {
  const [error, setError] = useState(null);
  
  const handleInitiate = async (e) => {
    e.preventDefault();
    setError(null);
    await onInitiatePayment();
  };
  
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amt);
  };
  
  // Show button to initiate payment if no clientSecret yet
  if (!clientSecret) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click the button below to securely enter your card details
        </p>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        <button
          onClick={handleInitiate}
          disabled={parentLoading || !amount}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {parentLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Initializing...
            </span>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </button>
      </div>
    );
  }
  
  // Render Stripe payment form when we have clientSecret
  return <CardPaymentFormWithStripe invoice={invoice} amount={amount} clientSecret={clientSecret} />;
};

export default CardPaymentForm;

