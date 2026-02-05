import api from './api';

// Get all conversations for current user
export const getConversations = async () => {
  try {
    const response = await api.get('/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch conversations';
  }
};

// Get single conversation with all messages
export const getConversation = async (conversationId) => {
  try {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch conversation';
  }
};

// Create or get conversation for an appointment
export const createConversation = async (appointmentId) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/conversations`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create conversation';
  }
};

// Send a message
export const sendMessage = async (conversationId, content) => {
  try {
    console.log('=== SEND MESSAGE SERVICE ===');
    console.log('Conversation ID:', conversationId);
    console.log('Content:', content);
    console.log('Making POST request to:', `/conversations/${conversationId}/messages`);

    const response = await api.post(`/conversations/${conversationId}/messages`, {
      message: { content }
    });

    console.log('Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('=== SERVICE ERROR ===');
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    throw error.response?.data?.error || 'Failed to send message';
  }
};
