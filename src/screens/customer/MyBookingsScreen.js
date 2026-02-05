import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, SegmentedButtons, Surface, Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Alert from '../../utils/Alert';
import { getMyAppointments, cancelBooking } from '../../services/appointmentsService';
import AppointmentCard from '../../components/AppointmentCard';
import AppointmentCardSkeleton from '../../components/skeletons/AppointmentCardSkeleton';
import { COLORS, SPACING } from '../../constants';

export default function MyBookingsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch appointments when screen comes into focus
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

      console.log('=== FETCHING MY APPOINTMENTS ===');
      console.log('Filters:', filters);

      const data = await getMyAppointments(filters);

      console.log('=== API RESPONSE ===');
      console.log('Full response:', data);
      console.log('Appointments array:', data.appointments);
      console.log('Appointments count:', data.appointments?.length);
      console.log('Meta:', data.meta);

      setAppointments(data.appointments);
    } catch (error) {
      console.log('=== ERROR FETCHING APPOINTMENTS ===');
      console.error('Error details:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(appointmentId);
              Alert.alert('Cancelled', 'Your booking has been cancelled');
              fetchAppointments(true);
            } catch (error) {
              Alert.alert('Error', error.toString());
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    fetchAppointments(true);
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyIcon}>
          📅
        </Text>
        <Text variant="titleMedium" style={styles.emptyText}>
          No bookings yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Browse appointments to make your first booking
        </Text>
      </View>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.textLight;
      case 'booked':
        return COLORS.primary;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.text;
    }
  };

  const renderAppointment = ({ item }) => {
    return (
      <Surface style={styles.cardWrapper}>
        <AppointmentCard
          appointment={item}
          onPress={() =>
            navigation.navigate('AppointmentDetails', { appointmentId: item.id })
          }
        />
        <View style={styles.statusBadge}>
          <Text
            variant="labelSmall"
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
        {item.status === 'completed' && !item.review && (
          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('LeaveReview', {
                appointmentId: item.id,
                stylistName: item.stylist.name,
                service: item.selected_service,
              })}
              style={styles.reviewButton}
              compact
              icon="star"
            >
              Leave Review
            </Button>
          </View>
        )}
        {(item.status === 'pending' || item.status === 'booked') && (
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => handleCancel(item.id)}
              style={styles.cancelButton}
              compact
              textColor={COLORS.error}
              icon="close-circle"
            >
              Cancel Booking
            </Button>
          </View>
        )}
      </Surface>
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
            { value: 'pending', label: 'Pending' },
            { value: 'booked', label: 'Confirmed' },
            { value: 'completed', label: 'Past' },
          ]}
        />
      </Surface>

      {loading ? (
        <View style={styles.skeletonContainer}>
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
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
    paddingBottom: SPACING.lg,
  },
  cardWrapper: {
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.lg,
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    elevation: 2,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  actions: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border || '#e0e0e0',
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
  },
  skeletonContainer: {
    padding: SPACING.md,
  },
  cancelButton: {
    borderColor: COLORS.error || '#d32f2f',
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
});
