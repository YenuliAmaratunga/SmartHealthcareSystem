import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaFileDownload, FaHome } from 'react-icons/fa';

/**
 * Payment Success Page
 * Displays confirmation after successful payment
 * Implements UC-003 Step 11 (Postconditions)
 */
const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction, invoice, amount } = location.state || {};
  
  if (!transaction) {
    navigate('/bills-and-payments');
    return null;
  }
  
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amt);
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleDownloadReceipt = () => {
    // TODO: Implement PDF receipt download
    alert('Receipt download functionality to be implemented');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully</p>
        </div>
        
        {/* Transaction Details Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono font-semibold text-gray-900">
                  {transaction.transactionId}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Number</span>
                <span className="font-semibold text-gray-900">
                  {invoice?.invoiceNumber || transaction.invoiceNumber}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Amount</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(amount || transaction.amount)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date</span>
                <span className="font-medium text-gray-900">
                  {formatDate(new Date())}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                  {transaction.status || 'Completed'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>📧 Confirmation Sent:</strong> A payment confirmation has been sent to your email and phone via SMS.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDownloadReceipt}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <FaFileDownload />
              Download Receipt
            </button>
            
            <button
              onClick={() => navigate('/bills-and-payments')}
              className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <FaHome />
              Return to Bills
            </button>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="text-center text-sm text-gray-600">
          <p>Need help? Contact our billing department at <a href="mailto:billing@hospital360.com" className="text-blue-600 hover:underline">billing@hospital360.com</a></p>
          <p className="mt-2">or call <a href="tel:+1234567890" className="text-blue-600 hover:underline">(123) 456-7890</a></p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

