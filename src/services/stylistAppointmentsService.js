import api from './api';

// Get stylist's appointments (all or filtered by status)
export const getStylistAppointments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const response = await api.get(`/stylist/appointments?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch appointments';
  }
};

// Accept a booking request
export const acceptAppointment = async (appointmentId) => {
  try {
    const response = await api.patch(`/stylist/appointments/${appointmentId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to accept appointment';
  }
};

// Decline/cancel an appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/stylist/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to cancel appointment';
  }
};

// Create new availability
export const createAvailability = async (appointmentData) => {
  try {
    const response = await api.post('/stylist/appointments', { appointment: appointmentData });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create availability';
  }
};

// Mark appointment as completed
export const completeAppointment = async (appointmentId) => {
  try {
    const response = await api.patch(`/stylist/appointments/${appointmentId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to complete appointment';
  }
};
