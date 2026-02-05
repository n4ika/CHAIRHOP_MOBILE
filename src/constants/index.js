import { Platform } from 'react-native';

export const API_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api/v1'
    : 'http://localhost:3000/api/v1'
  : 'https://your-production-url.com/api/v1';

export const COLORS = {
  primary: '#6200EE',
  primaryLight: '#7C4DFF',
  primaryDark: '#4527A0',
  secondary: '#03DAC6',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#212121',
  textLight: '#757575',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  border: '#E0E0E0',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
