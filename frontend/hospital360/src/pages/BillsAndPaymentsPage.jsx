import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientInvoices } from '../api/paymentapi';
import { FaFileInvoiceDollar, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

/**
 * Bills and Payments Page
 * Main page where patients view and select invoices to pay
 * Implements UC-003 Steps 1-4
 */
const BillsAndPaymentsPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, overdue
  
  // TODO: Get from authentication context
  const patientId = localStorage.getItem('patientId') || '507f1f77bcf86cd799439011';
  
  useEffect(() => {
    fetchInvoices();
  }, [patientId]);
  
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPatientInvoices(patientId);
      setInvoices(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };
  
  const getFilteredInvoices = () => {
    switch (filter) {
      case 'pending':
        return invoices.filter(inv => inv.status === 'Pending' || inv.status === 'Partially Paid');
      case 'overdue':
        return invoices.filter(inv => inv.isOverdue);
      case 'paid':
        return invoices.filter(inv => inv.status === 'Paid');
      default:
        return invoices;
    }
  };
  
  const getStatusBadge = (invoice) => {
    if (invoice.status === 'Paid') {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full flex items-center gap-1">
          <FaCheckCircle /> Paid
        </span>
      );
    }
    if (invoice.isOverdue) {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full flex items-center gap-1">
          <FaExclamationTriangle /> Overdue
        </span>
      );
    }
    if (invoice.status === 'Partially Paid') {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
          Partially Paid
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
        Pending
      </span>
    );
  };
  
  const handleMakePayment = (invoice) => {
    navigate('/payment', { state: { invoice } });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoices...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaFileInvoiceDollar className="text-blue-600" />
            My Bills and Payments
          </h1>
          <p className="mt-2 text-gray-600">View and pay your outstanding medical bills</p>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchInvoices}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}
        
        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Invoices
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'overdue'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Overdue
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'paid'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Paid
          </button>
        </div>
        
        {/* Invoices List */}
        {getFilteredInvoices().length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FaFileInvoiceDollar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No invoices found</h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'You have no invoices at this time.'
                : `You have no ${filter} invoices.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredInvoices().map((invoice) => (
              <div
                key={invoice.invoiceId}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Invoice Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {invoice.invoiceNumber}
                      </h3>
                      {getStatusBadge(invoice)}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Issue Date:</span>{' '}
                        {formatDate(invoice.issueDate)}
                      </p>
                      <p>
                        <span className="font-medium">Due Date:</span>{' '}
                        {formatDate(invoice.dueDate)}
                      </p>
                      {invoice.items && invoice.items.length > 0 && (
                        <p>
                          <span className="font-medium">Services:</span>{' '}
                          {invoice.items.map(item => item.description).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Amount Info */}
                  <div className="flex-shrink-0 text-right">
                    <div className="mb-2">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(invoice.totalAmount)}
                      </p>
                    </div>
                    
                    {invoice.paidAmount > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">Paid</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(invoice.paidAmount)}
                        </p>
                      </div>
                    )}
                    
                    {invoice.remainingAmount > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(invoice.remainingAmount)}
                        </p>
                      </div>
                    )}
                    
                    {/* Payment Button */}
                    {invoice.status !== 'Paid' && (
                      <button
                        onClick={() => handleMakePayment(invoice)}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                      >
                        Make Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillsAndPaymentsPage;

