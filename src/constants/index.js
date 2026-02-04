import { Platform } from 'react-native';

export const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api/v1'
    : 'http://localhost:3000/api/v1'
  : 'https://your-production-url.com/api/v1';

export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  border: '#e0e0e0',
  error: '#f44336',
  success: '#4caf50',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
