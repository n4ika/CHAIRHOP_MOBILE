import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import Alert from '../../utils/Alert';
import {
  Text,
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Chip,
  Surface,
} from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
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
    Alert.alert(
      'Book Appointment',
      `Book with ${appointment.stylist?.name} on ${formatDateLong(appointment.time)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setBooking(true);
            try {
              const bookingData = {
                selected_service: 'Haircut',
              };

              await bookAppointment(appointmentId, bookingData);

              Alert.alert(
                'Success!',
                'Booking request sent! The stylist will confirm shortly.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home'),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Booking Failed', error.toString());
            } finally {
              setBooking(false);
            }
          },
        },
      ]
    );
  };

  const openMaps = () => {
    const address = encodeURIComponent(appointment.location);
    const url = Platform.select({
      ios: `maps://app?daddr=${address}`,
      android: `geo:0,0?q=${address}`,
      web: `https://www.google.com/maps/search/?api=1&query=${address}`,
    });
    Linking.openURL(url);
  };

  const formatDateLong = (dateString) => {
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

  return (
    <ScrollView style={styles.container}>
      {/* Prominent Date/Time Card */}
      <Surface style={styles.dateTimeCard} elevation={2}>
        <View style={styles.dateTimeContent}>
          <Icon name="calendar" size={32} color={COLORS.primary} />
          <View style={styles.dateTimeText}>
            <Text variant="titleLarge" style={styles.dateText}>
              {formatDateLong(appointment.time)}
            </Text>
            <Text variant="titleMedium" style={styles.timeText}>
              {formatTime(appointment.time)}
            </Text>
          </View>
        </View>
      </Surface>

      <Card style={styles.card}>
        <Card.Content>
          {/* Stylist Info */}
          <View style={styles.section}>
            <Pressable onPress={() => navigation.navigate('StylistProfile', { stylist: appointment.stylist })}>
              <Text variant="headlineSmall" style={[styles.stylistName, styles.clickable]}>
                {appointment.stylist?.name}
              </Text>
            </Pressable>
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

          {/* Location */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📍 Where
            </Text>
            <Text variant="bodyLarge" style={styles.infoText}>
              {appointment.location}
            </Text>
            <Button
              mode="outlined"
              icon="directions"
              onPress={openMaps}
              style={styles.directionsButton}
              compact
            >
              Get Directions
            </Button>
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
  dateTimeCard: {
    margin: SPACING.md,
    marginBottom: 0,
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
  dateTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  dateTimeText: {
    flex: 1,
  },
  dateText: {
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  timeText: {
    color: COLORS.primary,
    fontWeight: '600',
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
  clickable: {
    textDecorationLine: 'underline',
    color: COLORS.primary,
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
  directionsButton: {
    marginTop: SPACING.sm,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
    borderRadius: 12,
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
