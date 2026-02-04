import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Alert from '../../utils/Alert';
import {
  Text,
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Chip,
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { getAppointment, bookAppointment } from '../../services/appointmentsService';
import { COLORS, SPACING } from '../../constants';

export default function AppointmentDetailsScreen({ route, navigation }) {
  const { appointmentId } = route.params;
  const { user } = useContext(AuthContext);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    console.log('=== AppointmentDetailsScreen Loaded ===');
    console.log('Appointment ID:', appointmentId);
    console.log('Current User:', user);
    fetchAppointment();
  }, []);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const data = await getAppointment(appointmentId);
      setAppointment(data);
    } catch (error) {
      Alert.alert('Error', error.toString());
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    console.log('=== BOOK BUTTON CLICKED ===');
    console.log('Appointment:', appointment);
    console.log('User:', user);
    console.log('Can book?', canBook);

    Alert.alert(
      'Book Appointment',
      `Book with ${appointment.stylist?.name} on ${formatDate(appointment.time)}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('User cancelled booking')
        },
        {
          text: 'Confirm',
          onPress: async () => {
            console.log('=== USER CONFIRMED BOOKING ===');
            setBooking(true);
            try {
              const bookingData = {
                selected_service: 'Haircut',
              };

              console.log('Sending booking request...');
              console.log('Appointment ID:', appointmentId);
              console.log('Booking data:', bookingData);

              const result = await bookAppointment(appointmentId, bookingData);

              console.log('=== BOOKING SUCCESS ===');
              console.log('Result:', result);

              Alert.alert(
                'Success!',
                'Booking request sent! The stylist will confirm shortly.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      console.log('Navigating to Home');
                      navigation.navigate('Home');
                    },
                  },
                ]
              );
            } catch (error) {
              console.log('=== BOOKING FAILED ===');
              console.error('Error details:', error);
              console.error('Error response:', error.response?.data);
              Alert.alert('Booking Failed', error.toString());
            } finally {
              setBooking(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading details...
        </Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="titleMedium">Appointment not found</Text>
      </View>
    );
  }

  const canBook = appointment.status === 'pending' && !appointment.customer;
  const isBooked = appointment.customer?.id === user?.id;

  console.log('Rendering buttons - canBook:', canBook, 'isBooked:', isBooked);
  console.log('Appointment status:', appointment.status, 'Customer:', appointment.customer);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Stylist Info */}
          <View style={styles.section}>
            <Text variant="headlineSmall" style={styles.stylistName}>
              {appointment.stylist?.name}
            </Text>
            <Text variant="bodyMedium" style={styles.username}>
              @{appointment.stylist?.username}
            </Text>
            {appointment.stylist?.location && (
              <Text variant="bodyMedium" style={styles.stylistLocation}>
                📍 {appointment.stylist.location}
              </Text>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Date & Time */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📅 When
            </Text>
            <Text variant="bodyLarge" style={styles.infoText}>
              {formatDate(appointment.time)}
            </Text>
            <Text variant="bodyLarge" style={styles.infoText}>
              {formatTime(appointment.time)}
            </Text>
          </View>

          <Divider style={styles.divider} />

          {/* Location */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📍 Where
            </Text>
            <Text variant="bodyLarge" style={styles.infoText}>
              {appointment.location}
            </Text>
          </View>

          {/* Services */}
          {appointment.services_text && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  ✨ Services Available
                </Text>
                <Text variant="bodyMedium" style={styles.servicesText}>
                  {appointment.services_text}
                </Text>
              </View>
            </>
          )}

          {/* Booked indicator */}
          {isBooked && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Chip icon="check-circle" mode="flat" style={styles.bookedChip} textStyle={styles.bookedChipText}>
                  You requested this appointment
                </Chip>
                <Text variant="bodyMedium" style={styles.bookedNote}>
                  Waiting for stylist confirmation
                </Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {canBook && (
          <Button
            mode="contained"
            onPress={handleBook}
            loading={booking}
            disabled={booking}
            style={styles.bookButton}
            contentStyle={styles.bookButtonContent}
            icon="calendar-check"
          >
            Book This Appointment
          </Button>
        )}

        {!canBook && !isBooked && appointment.customer && (
          <View style={styles.unavailableContainer}>
            <Text variant="bodyLarge" style={styles.unavailableMessage}>
              This appointment is no longer available
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textLight,
  },
  card: {
    margin: SPACING.md,
    backgroundColor: COLORS.card,
  },
  section: {
    paddingVertical: SPACING.md,
  },
  stylistName: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  username: {
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  stylistLocation: {
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  infoText: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  servicesText: {
    color: COLORS.text,
    lineHeight: 22,
  },
  divider: {
    backgroundColor: COLORS.border,
  },
  bookedChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.success + '20',
  },
  bookedChipText: {
    color: COLORS.success,
  },
  bookedNote: {
    marginTop: SPACING.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  actions: {
    padding: SPACING.md,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
  },
  bookButtonContent: {
    paddingVertical: SPACING.sm,
  },
  unavailableContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  unavailableMessage: {
    textAlign: 'center',
    color: COLORS.textLight,
  },
});
