import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { addNotificationResponseListener } from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    const subscription = addNotificationResponseListener(response => {
      const data = response.notification.request.content.data;

      if (data.type === 'booking_request' && data.appointment_id) {
        console.log('Navigate to appointment:', data.appointment_id);
      } else if (data.type === 'booking_accepted' && data.appointment_id) {
        console.log('Navigate to my bookings');
      } else if (data.type === 'review_request' && data.appointment_id) {
        console.log('Navigate to leave review');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
