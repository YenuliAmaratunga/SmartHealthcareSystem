import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:5003/api/payments';

/**
 * Payment API Service
 * Handles all API calls to the payment service
 */

/**
 * Get patient's outstanding invoices
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} List of invoices
 */
export const getPatientInvoices = async (patientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/invoices/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error.response?.data || error;
  }
};

/**
 * Initiate a new card payment
 * @param {Object} paymentData - Payment information
 * @returns {Promise<Object>} Payment initiation details with client secret
 */
export const initiateCardPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/initiate-card-payment`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error.response?.data || error;
  }
};

/**
 * Process payment with saved card
 * @param {Object} paymentData - Payment information with saved card
 * @returns {Promise<Object>} Payment result
 */
export const processSavedCardPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/process-saved-card`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error processing saved card payment:', error);
    throw error.response?.data || error;
  }
};

/**
 * Confirm payment after Stripe processing
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Confirmation result
 */
export const confirmPayment = async (paymentIntentId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/confirm`, { paymentIntentId });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error.response?.data || error;
  }
};

/**
 * Handle payment failure
 * @param {Object} failureData - Failure information
 * @returns {Promise<Object>} Failure handling result
 */
export const handlePaymentFailure = async (failureData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/handle-failure`, failureData);
    return response.data;
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get patient's saved cards
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} List of saved cards
 */
export const getSavedCards = async (patientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/saved-cards/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved cards:', error);
    throw error.response?.data || error;
  }
};

/**
 * Save a new payment method
 * @param {Object} cardData - Card information
 * @returns {Promise<Object>} Saved card details
 */
export const savePaymentMethod = async (cardData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save-card`, cardData);
    return response.data;
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw error.response?.data || error;
  }
};

/**
 * Remove a saved card
 * @param {string} cardId - Card ID
 * @param {string} patientId - Patient ID
 * @returns {Promise<Object>} Removal confirmation
 */
export const removeSavedCard = async (cardId, patientId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/saved-cards/${cardId}`, {
      data: { patientId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing saved card:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get payment history for a patient
 * @param {string} patientId - Patient ID
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} Payment history
 */
export const getPaymentHistory = async (patientId, filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_BASE_URL}/history/${patientId}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get payment by transaction ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentByTransactionId = async (transactionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error.response?.data || error;
  }
};

export default {
  getPatientInvoices,
  initiateCardPayment,
  processSavedCardPayment,
  confirmPayment,
  handlePaymentFailure,
  getSavedCards,
  savePaymentMethod,
  removeSavedCard,
  getPaymentHistory,
  getPaymentByTransactionId,
};

