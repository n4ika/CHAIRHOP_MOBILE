import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper';
import {
  SQIPCore,
  SQIPCardEntry
} from 'react-native-square-in-app-payments';
import { createPayment } from '../../services/paymentService';
import Alert from '../../utils/Alert';
import { COLORS, SPACING } from '../../constants';

export default function PaymentScreen({ route, navigation }) {
  const { appointmentId, amount, serviceName } = route.params;
  const [loading, setLoading] = useState(false);
  const [squareInitialized, setSquareInitialized] = useState(false);

  useEffect(() => {
    initializeSquare();
  }, []);

  const initializeSquare = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Not Available on Web',
        'Square payments require the mobile app. Please use iOS or Android.'
      );
      return;
    }

    try {
      await SQIPCore.setSquareApplicationId('sandbox-sq0idb-YOUR_SANDBOX_APP_ID');
      setSquareInitialized(true);
    } catch (error) {
      console.error('Error initializing Square:', error);
      Alert.alert('Error', 'Failed to initialize payment system');
    }
  };

  const handleCardEntry = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Use mobile app for payments');
      return;
    }

    try {
      const cardEntryResult = await SQIPCardEntry.startCardEntryFlow();

      if (cardEntryResult.canceled) {
        return;
      }

      // Process payment
      setLoading(true);
      await createPayment(appointmentId, cardEntryResult.nonce);

      Alert.alert(
        'Payment Successful!',
        'Your appointment is confirmed',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyBookings')
          }
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Failed', error.toString());
    } finally {
      setLoading(false);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Surface style={styles.card} elevation={2}>
          <Text variant="headlineSmall" style={styles.title}>
            Payment Not Available on Web
          </Text>
          <Text variant="bodyMedium" style={styles.message}>
            Please use the iOS or Android app to complete payment.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Go Back
          </Button>
        </Surface>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Surface style={styles.card} elevation={2}>
        <Text variant="headlineSmall" style={styles.title}>
          Complete Payment
        </Text>

        {/* Appointment Details */}
        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.serviceName}>
            {serviceName}
          </Text>
          <View style={styles.amountRow}>
            <Text variant="bodyLarge">Total:</Text>
            <Text variant="headlineMedium" style={styles.amount}>
              ${amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Button */}
        {squareInitialized ? (
          <Button
            mode="contained"
            onPress={handleCardEntry}
            loading={loading}
            disabled={loading}
            style={styles.payButton}
            icon="credit-card"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        ) : (
          <ActivityIndicator size="large" style={styles.loader} />
        )}

        <Text variant="bodySmall" style={styles.disclaimer}>
          Powered by Square - Secure Payment
        </Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  card: {
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.text,
  },
  details: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  serviceName: {
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: COLORS.text,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  payButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  loader: {
    marginVertical: SPACING.xl,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: SPACING.md,
    color: COLORS.textLight,
  },
  message: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLORS.textLight,
  },
  button: {
    marginTop: SPACING.md,
  },
});
