import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CardPaymentForm from '../components/PaymentComponents/CardPaymentForm';
import SavedCardsList from '../components/PaymentComponents/SavedCardsList';
import PaymentSummary from '../components/PaymentComponents/PaymentSummary';
import { getSavedCards, initiateCardPayment, processSavedCardPayment } from '../api/paymentapi';
import { FaCreditCard, FaLock } from 'react-icons/fa';

// Initialize Stripe (use your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

/**
 * Payment Page
 * Handles payment method selection and processing
 * Implements UC-003 Steps 5-10
 */
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoice } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState('new-card'); // 'new-card' or 'saved-card'
  const [paymentAmount, setPaymentAmount] = useState('full'); // 'full' or 'partial'
  const [customAmount, setCustomAmount] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // TODO: Get from authentication context
  const patientId = localStorage.getItem('patientId') || '507f1f77bcf86cd799439011';
  const patientInfo = {
    email: localStorage.getItem('patientEmail') || 'patient@example.com',
    name: localStorage.getItem('patientName') || 'John Doe',
    phone: localStorage.getItem('patientPhone') || '1234567890',
  };
  
  useEffect(() => {
    if (!invoice) {
      navigate('/bills-and-payments');
      return;
    }
    
    fetchSavedCards();
  }, [invoice, navigate]);
  
  const fetchSavedCards = async () => {
    try {
      const response = await getSavedCards(patientId);
      setSavedCards(response.data || []);
      
      // Auto-select default card if available
      const defaultCard = response.data?.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCard(defaultCard);
        setPaymentMethod('saved-card');
      }
    } catch (err) {
      console.error('Error fetching saved cards:', err);
    }
  };
  
  const getPaymentAmountValue = () => {
    if (paymentAmount === 'full') {
      return invoice.remainingAmount;
    }
    return parseFloat(customAmount) || 0;
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError(null);
  };
  
  const handlePaymentAmountChange = (type) => {
    setPaymentAmount(type);
    if (type === 'full') {
      setCustomAmount('');
    }
    setError(null);
  };
  
  const validatePayment = () => {
    const amount = getPaymentAmountValue();
    
    if (amount <= 0) {
      setError('Payment amount must be greater than zero');
      return false;
    }
    
    if (amount > invoice.remainingAmount) {
      setError('Payment amount cannot exceed remaining balance');
      return false;
    }
    
    if (paymentMethod === 'saved-card' && !selectedCard) {
      setError('Please select a saved card');
      return false;
    }
    
    return true;
  };
  
  const handleInitiateNewCardPayment = async () => {
    if (!validatePayment()) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const amount = getPaymentAmountValue();
      const paymentType = paymentAmount === 'full' ? 'Full' : 'Partial';
      
      const response = await initiateCardPayment({
        patientId,
        invoiceId: invoice.invoiceId,
        amount,
        paymentType,
        patientInfo,
      });
      
      if (response.success && response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
        return response.data;
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const handleProcessSavedCardPayment = async () => {
    if (!validatePayment()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const amount = getPaymentAmountValue();
      const paymentType = paymentAmount === 'full' ? 'Full' : 'Partial';
      
      const response = await processSavedCardPayment({
        patientId,
        invoiceId: invoice.invoiceId,
        amount,
        paymentType,
        savedCardId: selectedCard.cardId,
      });
      
      if (response.success) {
        navigate('/payment-success', {
          state: {
            transaction: response.data,
            invoice,
            amount,
          },
        });
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed');
      
      // Navigate to failure page for serious errors
      if (err.message.includes('card_declined') || err.message.includes('insufficient')) {
        navigate('/payment-failure', {
          state: {
            error: err.message,
            invoice,
            canRetry: true,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  if (!invoice) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/bills-and-payments')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Bills
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaCreditCard className="text-blue-600" />
            Make Payment
          </h1>
          <p className="mt-2 text-gray-600">Complete your payment securely</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {/* Payment Amount Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Amount</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="amount-type"
                    checked={paymentAmount === 'full'}
                    onChange={() => handlePaymentAmountChange('full')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 flex-1">
                    <span className="block font-medium text-gray-900">Pay Full Amount</span>
                    <span className="block text-sm text-gray-600">
                      {formatCurrency(invoice.remainingAmount)}
                    </span>
                  </span>
                </label>
                
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="amount-type"
                    checked={paymentAmount === 'partial'}
                    onChange={() => handlePaymentAmountChange('partial')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 flex-1">
                    <span className="block font-medium text-gray-900">Pay Other Amount</span>
                    {paymentAmount === 'partial' && (
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="0.01"
                        max={invoice.remainingAmount}
                        step="0.01"
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </span>
                </label>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handlePaymentMethodChange('new-card')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition ${
                    paymentMethod === 'new-card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">Credit/Debit Card</span>
                  <p className="text-sm text-gray-600 mt-1">Pay with a new card</p>
                </button>
                
                {savedCards.length > 0 && (
                  <button
                    onClick={() => handlePaymentMethodChange('saved-card')}
                    className={`w-full p-4 border-2 rounded-lg text-left transition ${
                      paymentMethod === 'saved-card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900">Saved Card</span>
                    <p className="text-sm text-gray-600 mt-1">Use a previously saved card</p>
                  </button>
                )}
              </div>
              
              {/* Payment Form */}
              {paymentMethod === 'new-card' ? (
                clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CardPaymentForm
                      invoice={invoice}
                      amount={getPaymentAmountValue()}
                      onInitiatePayment={handleInitiateNewCardPayment}
                      clientSecret={clientSecret}
                      loading={loading}
                    />
                  </Elements>
                ) : (
                  <CardPaymentForm
                    invoice={invoice}
                    amount={getPaymentAmountValue()}
                    onInitiatePayment={handleInitiateNewCardPayment}
                    clientSecret={clientSecret}
                    loading={loading}
                  />
                )
              ) : (
                <SavedCardsList
                  cards={savedCards}
                  selectedCard={selectedCard}
                  onSelectCard={setSelectedCard}
                  onProcessPayment={handleProcessSavedCardPayment}
                  loading={loading}
                />
              )}
            </div>
            
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <FaLock />
              <span>Secured by Stripe - Your payment information is encrypted</span>
            </div>
          </div>
          
          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-1">
            <PaymentSummary
              invoice={invoice}
              paymentAmount={getPaymentAmountValue()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

