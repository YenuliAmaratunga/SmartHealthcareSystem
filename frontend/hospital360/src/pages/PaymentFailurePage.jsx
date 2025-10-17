import { useLocation, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

/**
 * Payment Failure Page
 * Handles payment errors and retry options
 * Implements UC-003 Exception Flows (E1, E2, E4) and Alternative Flow A4
 */
const PaymentFailurePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, invoice, canRetry = true } = location.state || {};
  
  if (!error) {
    navigate('/bills-and-payments');
    return null;
  }
  
  const getErrorMessage = (errorMsg) => {
    const lowerError = (errorMsg || '').toLowerCase();
    
    // E1: Invalid Card Details
    if (lowerError.includes('card') && (lowerError.includes('invalid') || lowerError.includes('incorrect'))) {
      return {
        title: 'Invalid Card Details',
        message: 'The card information provided is incorrect or invalid. Please check your card details and try again.',
        icon: '💳',
        type: 'card_error',
      };
    }
    
    // E2: Insufficient Funds
    if (lowerError.includes('insufficient') || lowerError.includes('declined')) {
      return {
        title: 'Payment Declined',
        message: 'Your card was declined. This could be due to insufficient funds or your bank blocking the transaction. Please try a different payment method or contact your bank.',
        icon: '🚫',
        type: 'card_declined',
      };
    }
    
    // E4: Payment Gateway Timeout/Failure
    if (lowerError.includes('timeout') || lowerError.includes('gateway') || lowerError.includes('network')) {
      return {
        title: 'Payment Gateway Error',
        message: 'We couldn\'t process your payment due to a connection issue. Please try again in a few moments.',
        icon: '⚠️',
        type: 'gateway_error',
      };
    }
    
    // Expired card
    if (lowerError.includes('expired')) {
      return {
        title: 'Card Expired',
        message: 'The payment card has expired. Please use a different card or update your card details.',
        icon: '📅',
        type: 'expired_card',
      };
    }
    
    // Generic error
    return {
      title: 'Payment Failed',
      message: errorMsg || 'An unexpected error occurred while processing your payment. Please try again.',
      icon: '⚠️',
      type: 'generic',
    };
  };
  
  const errorInfo = getErrorMessage(error);
  
  const handleRetry = () => {
    if (invoice) {
      navigate('/payment', { state: { invoice } });
    } else {
      navigate('/bills-and-payments');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <FaExclamationTriangle className="text-5xl text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
          <p className="text-gray-600">Your payment could not be completed</p>
        </div>
        
        {/* Error Details Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">{errorInfo.icon}</span>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">What happened?</h3>
                <p className="text-red-800">{errorInfo.message}</p>
              </div>
            </div>
          </div>
          
          {/* Invoice Info (if available) */}
          {invoice && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Invoice Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Number</span>
                  <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Due</span>
                  <span className="font-bold text-red-600">
                    ${invoice.remainingAmount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Suggestions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Suggestions</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              {errorInfo.type === 'card_error' && (
                <>
                  <li>Double-check your card number, expiry date, and CVV</li>
                  <li>Make sure your billing address is correct</li>
                  <li>Try a different payment card</li>
                </>
              )}
              {errorInfo.type === 'card_declined' && (
                <>
                  <li>Check if you have sufficient funds in your account</li>
                  <li>Contact your bank to authorize the payment</li>
                  <li>Try using a different payment method</li>
                </>
              )}
              {errorInfo.type === 'gateway_error' && (
                <>
                  <li>Wait a few minutes and try again</li>
                  <li>Check your internet connection</li>
                  <li>Try using a different browser</li>
                </>
              )}
              {errorInfo.type === 'expired_card' && (
                <>
                  <li>Use a different payment card</li>
                  <li>Contact your bank for a replacement card</li>
                </>
              )}
              <li>Contact our support team if the problem persists</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            {canRetry && (
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <FaRedo />
                Try Again
              </button>
            )}
            
            <button
              onClick={() => navigate('/bills-and-payments')}
              className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <FaHome />
              Return to Bills
            </button>
          </div>
        </div>
        
        {/* Support Information */}
        <div className="text-center text-sm text-gray-600">
          <p className="font-semibold text-gray-900 mb-2">Need Help?</p>
          <p>Contact our billing support team</p>
          <p className="mt-2">
            Email: <a href="mailto:billing@hospital360.com" className="text-blue-600 hover:underline">billing@hospital360.com</a>
          </p>
          <p>
            Phone: <a href="tel:+1234567890" className="text-blue-600 hover:underline">(123) 456-7890</a>
          </p>
          <p className="mt-2 text-xs text-gray-500">Available 24/7 for assistance</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;

