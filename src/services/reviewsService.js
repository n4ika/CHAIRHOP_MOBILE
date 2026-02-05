import api from './api';

// Submit a review for a completed appointment
export const submitReview = async (appointmentId, reviewData) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/review`, {
      review: reviewData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to submit review';
  }
};

// Get reviews for a stylist
export const getStylistReviews = async (stylistId) => {
  try {
    const response = await api.get(`/reviews?stylist_id=${stylistId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch reviews';
  }
};
