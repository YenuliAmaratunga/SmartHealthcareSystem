import { useState } from 'react';
import { FaCreditCard, FaTrash, FaStar } from 'react-icons/fa';
import { removeSavedCard } from '../../api/paymentapi';

/**
 * Saved Cards List Component
 * Displays and manages patient's saved payment methods
 * Implements UC-003 Alternative Flow A3 (Saved Card Payment)
 */
const SavedCardsList = ({ cards, selectedCard, onSelectCard, onProcessPayment, loading }) => {
  const [removing, setRemoving] = useState(null);
  
  const getCardIcon = (brand) => {
    return <FaCreditCard className="text-2xl text-gray-600" />;
  };
  
  const handleRemoveCard = async (card, e) => {
    e.stopPropagation(); // Prevent card selection
    
    if (!confirm('Are you sure you want to remove this card?')) {
      return;
    }
    
    try {
      setRemoving(card.cardId);
      const patientId = localStorage.getItem('patientId') || '507f1f77bcf86cd799439011';
      await removeSavedCard(card.cardId, patientId);
      
      // Reload page to refresh card list
      window.location.reload();
    } catch (error) {
      alert('Failed to remove card. Please try again.');
    } finally {
      setRemoving(null);
    }
  };
  
  const formatExpiry = (month, year) => {
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
  };
  
  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <FaCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No saved cards available</p>
        <p className="text-sm text-gray-500 mt-2">Use a new card and save it for future payments</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Saved Cards */}
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.cardId}
            onClick={() => onSelectCard(card)}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedCard?.cardId === card.cardId
                ? 'border-blue-500 bg-blue-50'
                : card.isExpired
                ? 'border-gray-300 bg-gray-50 opacity-60'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            {/* Default Badge */}
            {card.isDefault && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full flex items-center gap-1">
                  <FaStar className="text-xs" /> Default
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              {/* Card Icon */}
              <div>{getCardIcon(card.brand)}</div>
              
              {/* Card Details */}
              <div className="flex-1">
                <div className="font-medium text-gray-900 capitalize">
                  {card.brand} {card.last4 ? `•••• ${card.last4}` : card.maskedNumber}
                </div>
                <div className="text-sm text-gray-600">
                  Expires {formatExpiry(card.expiryMonth, card.expiryYear)}
                  {card.isExpired && (
                    <span className="ml-2 text-red-600 font-medium">(Expired)</span>
                  )}
                </div>
              </div>
              
              {/* Remove Button */}
              {!card.isExpired && (
                <button
                  onClick={(e) => handleRemoveCard(card, e)}
                  disabled={removing === card.cardId}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                  title="Remove card"
                >
                  {removing === card.cardId ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Pay Button */}
      <button
        onClick={onProcessPayment}
        disabled={!selectedCard || selectedCard.isExpired || loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </span>
        ) : (
          'Pay with Selected Card'
        )}
      </button>
      
      {selectedCard?.isExpired && (
        <p className="text-sm text-red-600 text-center">
          This card has expired. Please select a different card or use a new card.
        </p>
      )}
    </div>
  );
};

export default SavedCardsList;

