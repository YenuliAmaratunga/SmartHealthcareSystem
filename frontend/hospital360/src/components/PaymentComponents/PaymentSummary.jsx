import { FaFileInvoiceDollar, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

/**
 * Payment Summary Component
 * Displays invoice details and payment breakdown
 */
const PaymentSummary = ({ invoice, paymentAmount }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const newRemainingBalance = invoice.remainingAmount - paymentAmount;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <FaFileInvoiceDollar className="text-blue-600" />
        Payment Summary
      </h2>
      
      <div className="space-y-4">
        {/* Invoice Number */}
        <div>
          <p className="text-sm text-gray-600">Invoice Number</p>
          <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
        </div>
        
        {/* Dates */}
        <div className="flex items-start gap-2">
          <FaCalendarAlt className="text-gray-600 mt-1" />
          <div>
            <p className="text-sm text-gray-600">Issue Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(invoice.issueDate)}
            </p>
            <p className="text-sm text-gray-600 mt-2">Due Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
        
        {/* Services */}
        {invoice.items && invoice.items.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Services</p>
            <div className="space-y-1">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.description} {item.quantity > 1 && `(×${item.quantity})`}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <hr className="border-gray-200" />
        
        {/* Amount Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Total Invoice Amount</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>
          
          {invoice.paidAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Previously Paid</span>
              <span className="font-semibold">
                -{formatCurrency(invoice.paidAmount)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">Current Balance</span>
            <span className="text-red-600">
              {formatCurrency(invoice.remainingAmount)}
            </span>
          </div>
        </div>
        
        <hr className="border-gray-200" />
        
        {/* Payment Amount */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaMoneyBillWave className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Payment Amount</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(paymentAmount)}
          </p>
        </div>
        
        {/* New Balance */}
        {newRemainingBalance > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">New Balance After Payment</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(newRemainingBalance)}
            </span>
          </div>
        )}
        
        {newRemainingBalance === 0 && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              ✓ This payment will settle your invoice in full
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;

