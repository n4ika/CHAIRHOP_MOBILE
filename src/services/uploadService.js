import api from './api';

// Upload avatar
export const uploadAvatar = async (imageUri) => {
  try {
    const formData = new FormData();

    // Get file extension
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('avatar', {
      uri: imageUri,
      name: `avatar.${fileType}`,
      type: `image/${fileType}`,
    });

    const response = await api.post('/uploads/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to upload avatar';
  }
};

// Upload appointment image (stylist portfolio)
export const uploadAppointmentImage = async (appointmentId, imageUri) => {
  try {
    const formData = new FormData();

    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('image', {
      uri: imageUri,
      name: `appointment.${fileType}`,
      type: `image/${fileType}`,
    });

    const response = await api.post(`/appointments/${appointmentId}/upload_image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to upload image';
  }
};

// Upload message photo
export const uploadMessagePhoto = async (conversationId, imageUri, caption = '') => {
  try {
    const formData = new FormData();

    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('photo', {
      uri: imageUri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    if (caption) {
      formData.append('caption', caption);
    }

    const response = await api.post(`/conversations/${conversationId}/upload_photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to upload photo';
  }
};
