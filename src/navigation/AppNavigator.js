import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/HomeScreen';
import BrowseAppointmentsScreen from '../screens/customer/BrowseAppointmentsScreen';
import AppointmentDetailsScreen from '../screens/customer/AppointmentDetailsScreen';
import MyBookingsScreen from '../screens/customer/MyBookingsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'ChairHop' }}
          />
          <Stack.Screen
            name="BrowseAppointments"
            component={BrowseAppointmentsScreen}
            options={{ title: 'Browse Appointments' }}
          />
          <Stack.Screen
            name="AppointmentDetails"
            component={AppointmentDetailsScreen}
            options={{ title: 'Appointment Details' }}
          />
          <Stack.Screen
            name="MyBookings"
            component={MyBookingsScreen}
            options={{ title: 'My Bookings' }}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
