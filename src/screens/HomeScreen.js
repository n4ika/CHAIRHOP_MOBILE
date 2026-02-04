import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING } from '../constants';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
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

      {user?.role === 'customer' ? (
        <>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('BrowseAppointments')}
            style={styles.button}
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
        <Button
          mode="contained"
          onPress={() => navigation.navigate('StylistAppointments')}
          style={styles.button}
          icon="calendar-multiple"
        >
          My Appointments
        </Button>
      )}

      <Button mode="contained" onPress={signOut} style={styles.button}>
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    marginBottom: SPACING.md,
    color: COLORS.primary,
  },
  subtitle: {
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  info: {
    marginBottom: SPACING.xs,
    color: COLORS.textLight,
  },
  button: {
    marginTop: SPACING.xl,
  },
});
