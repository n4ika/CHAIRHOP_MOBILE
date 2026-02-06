import React, { useContext } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING } from '../constants';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);

  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'Push notifications are working!',
        data: { test: true },
      },
      trigger: { seconds: 1 },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome, {user?.name}!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Role: {user?.role}
        </Text>
        <Text variant="bodyMedium" style={styles.info}>
          Email: {user?.email}
        </Text>
        <Text variant="bodyMedium" style={styles.info}>
          Username: {user?.username}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {user?.role === 'customer' ? (
          <>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('BrowseAppointments')}
              style={styles.button}
              icon="magnify"
            >
              Browse Appointments
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('MyBookings')}
              style={styles.button}
              icon="calendar-check"
            >
              My Bookings
            </Button>
          </>
        ) : (
          <>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('StylistAppointments')}
              style={styles.button}
              icon="calendar-multiple"
            >
              My Appointments
            </Button>
          </>
        )}

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Conversations')}
          style={styles.button}
          icon="message-text"
        >
          Messages
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Profile')}
          style={styles.button}
          icon="account"
        >
          Profile
        </Button>

        <Button
          mode="outlined"
          onPress={sendTestNotification}
          style={styles.button}
          icon="bell-ring"
        >
          Test Notification
        </Button>

        <Button
          mode="outlined"
          onPress={signOut}
          style={styles.button}
          icon="logout"
          textColor={COLORS.error}
        >
          Sign Out
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  title: {
    marginBottom: SPACING.md,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  info: {
    marginBottom: SPACING.xs,
    color: COLORS.textLight,
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  button: {
    borderRadius: 12,
  },
});
