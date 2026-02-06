import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import { registerForPushNotifications, sendPushTokenToBackend } from '../services/notificationService';
import { initializeCable, disconnectCable } from '../services/actionCableService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.log('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerNotifications = async () => {
    const token = await registerForPushNotifications();
    if (token) {
      await sendPushTokenToBackend(token);
    }
  };

  const signIn = async (email, password) => {
    const { user: userData } = await authService.login(email, password);
    setUser(userData);
    registerNotifications();
    console.log('=== CALLING INITIALIZE CABLE FROM LOGIN ===');
    await initializeCable();
    console.log('=== CABLE INITIALIZATION COMPLETE ===');
  };

  const signUp = async (email, password, name, username, role) => {
    const { user: userData } = await authService.signup(email, password, name, username, role);
    setUser(userData);
    registerNotifications();
    console.log('=== CALLING INITIALIZE CABLE FROM SIGNUP ===');
    await initializeCable();
    console.log('=== CABLE INITIALIZATION COMPLETE ===');
  };

  const signOut = async () => {
    disconnectCable();
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
