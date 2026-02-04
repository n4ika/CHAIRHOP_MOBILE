import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });

    // Extract token from Authorization header
    const token = response.headers.authorization;
    const userData = response.data.user;

    // Store token and user data
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    return { token, user: userData };
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

export const signup = async (email, password, name, username, role = 'customer') => {
  try {
    const response = await api.post('/signup', {
      user: { email, password, name, username, role }
    });

    const token = response.headers.authorization;
    const userData = response.data.user;

    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    return { token, user: userData };
  } catch (error) {
    throw error.response?.data?.error || 'Signup failed';
  }
};

export const logout = async () => {
  try {
    await api.delete('/logout');
  } catch (error) {
    console.log('Logout API call failed:', error);
  } finally {
    // Always clear local storage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  }
};

export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};
