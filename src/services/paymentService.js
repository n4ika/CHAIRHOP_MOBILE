import api from './api';

// Create payment
export const createPayment = async (appointmentId, sourceId) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/payment`, {
      source_id: sourceId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Payment failed';
  }
};

// Get payment status
export const getPaymentStatus = async (appointmentId) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}/payment/status`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to get payment status';
  }
};

// Refund payment
export const refundPayment = async (appointmentId) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/payment/refund`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Refund failed';
  }
};
