import api from './api';

// Browse available appointments
export const getAppointments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.location) params.append('location', filters.location);
    if (filters.date) params.append('date', filters.date);
    if (filters.service_id) params.append('service_id', filters.service_id);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const response = await api.get(`/appointments?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch appointments';
  }
};

// Get single appointment details
export const getAppointment = async (id) => {
  try {
    const response = await api.get(`/appointments/${id}`);
    return response.data.appointment;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch appointment';
  }
};

// Book an appointment
export const bookAppointment = async (appointmentId, bookingData) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/book`, bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to book appointment';
  }
};

// Get my appointments
export const getMyAppointments = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.per_page) params.append('per_page', filters.per_page);

    const response = await api.get(`/appointments/my_appointments?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch your appointments';
  }
};

// Cancel a booking
export const cancelBooking = async (appointmentId) => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to cancel booking';
  }
};
