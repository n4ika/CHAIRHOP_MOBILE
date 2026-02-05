import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, SegmentedButtons, Surface, FAB, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Alert from '../../utils/Alert';
import { getStylistAppointments, acceptAppointment, cancelAppointment, completeAppointment } from '../../services/stylistAppointmentsService';
import { COLORS, SPACING } from '../../constants';

export default function StylistAppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [statusFilter])
  );

  const fetchAppointments = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const filters = {
        per_page: 50,
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const data = await getStylistAppointments(filters);
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Error fetching stylist appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = async (appointmentId) => {
    Alert.alert(
      'Accept Booking',
      'Confirm this appointment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              await acceptAppointment(appointmentId);
              Alert.alert('Success', 'Appointment accepted!');
              fetchAppointments(true);
            } catch (error) {
              Alert.alert('Error', error.toString());
            }
          },
        },
      ]
    );
  };

  const handleCancel = async (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment(appointmentId);
              Alert.alert('Cancelled', 'Appointment cancelled');
              fetchAppointments(true);
            } catch (error) {
              Alert.alert('Error', error.toString());
            }
          },
        },
      ]
    );
  };

  const handleComplete = async (appointmentId) => {
    Alert.alert(
      'Mark as Completed',
      'Mark this appointment as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await completeAppointment(appointmentId);
              Alert.alert('Success', 'Appointment marked as completed');
              fetchAppointments(true);
            } catch (error) {
              Alert.alert('Error', error.toString());
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
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

  const renderAppointment = ({ item }) => {
    const isPending = item.status === 'pending' && item.customer;
    const isAvailable = item.status === 'pending' && !item.customer;
    const isBooked = item.status === 'booked';

    return (
      <Surface style={styles.card} elevation={1}>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.dateTime}>
            {formatDate(item.time)} at {formatTime(item.time)}
          </Text>
          <Text
            variant="labelSmall"
            style={[
              styles.status,
              isPending && styles.statusPending,
              isBooked && styles.statusBooked,
              isAvailable && styles.statusAvailable,
            ]}
          >
            {isPending ? 'NEW REQUEST' : item.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.cardBody}>
          <Text variant="bodyMedium" style={styles.location}>
            📍 {item.location}
          </Text>

          {item.customer && (
            <View style={styles.customerInfo}>
              <Text variant="bodyMedium" style={styles.customerLabel}>
                Customer:
              </Text>
              <Text variant="bodyMedium" style={styles.customerName}>
                {item.customer.name}
              </Text>
            </View>
          )}

          {item.selected_service && (
            <Text variant="bodySmall" style={styles.service}>
              Service: {item.selected_service}
            </Text>
          )}
        </View>

        {isPending && (
          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => handleAccept(item.id)}
              style={[styles.actionButton, styles.acceptButton]}
              compact
              icon="check-circle"
            >
              Accept
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleCancel(item.id)}
              style={styles.actionButton}
              compact
              icon="close-circle"
              textColor={COLORS.error}
            >
              Decline
            </Button>
          </View>
        )}

        {isBooked && (
          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => handleComplete(item.id)}
              style={[styles.actionButton, styles.completeButton]}
              compact
              icon="check-circle"
            >
              Mark Complete
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleCancel(item.id)}
              style={styles.actionButton}
              compact
              icon="close-circle"
              textColor={COLORS.error}
            >
              Cancel
            </Button>
          </View>
        )}
      </Surface>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyIcon}>
          📅
        </Text>
        <Text variant="titleMedium" style={styles.emptyText}>
          No appointments
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Create availability to get bookings
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.filterContainer} elevation={1}>
        <SegmentedButtons
          value={statusFilter}
          onValueChange={setStatusFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Requests' },
            { value: 'booked', label: 'Confirmed' },
            { value: 'completed', label: 'Past' },
          ]}
        />
      </Surface>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading appointments...
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAppointments(true)} />
          }
        />
      )}

      <FAB
        icon="plus"
        label="Add Availability"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateAvailability')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.card,
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
  listContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dateTime: {
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  status: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  statusPending: {
    backgroundColor: COLORS.primary + '20',
    color: COLORS.primary,
  },
  statusBooked: {
    backgroundColor: COLORS.success + '20',
    color: COLORS.success,
  },
  statusAvailable: {
    backgroundColor: COLORS.textLight + '20',
    color: COLORS.textLight,
  },
  cardBody: {
    marginBottom: SPACING.sm,
  },
  location: {
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  customerInfo: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  customerLabel: {
    color: COLORS.textLight,
    marginRight: SPACING.xs,
  },
  customerName: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  service: {
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flex: 1,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
  },
  completeButton: {
    backgroundColor: COLORS.success,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
});
