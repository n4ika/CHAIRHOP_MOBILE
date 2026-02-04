import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button, Searchbar } from 'react-native-paper';
import { getAppointments } from '../../services/appointmentsService';
import AppointmentCard from '../../components/AppointmentCard';
import { COLORS, SPACING } from '../../constants';

export default function BrowseAppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      } else {
        setLoading(true);
      }

      const filters = {
        page: refresh ? 1 : page,
        per_page: 20, // Get more results for local filtering
      };

      const data = await getAppointments(filters);

      // Filter locally by search query
      let filteredAppointments = data.appointments;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredAppointments = data.appointments.filter(apt =>
          apt.location?.toLowerCase().includes(query) ||
          apt.stylist?.name?.toLowerCase().includes(query) ||
          apt.stylist?.location?.toLowerCase().includes(query)
        );
      }

      if (refresh) {
        setAppointments(filteredAppointments);
      } else {
        setAppointments(prev => page === 1 ? filteredAppointments : [...prev, ...filteredAppointments]);
      }

      setHasMore(data.meta.current_page < data.meta.total_pages);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAppointments(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchAppointments();
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchAppointments(true);
  };

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text variant="titleMedium" style={styles.emptyText}>
          No appointments found
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Try adjusting your search or check back later
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by location or stylist"
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={handleSearch}
        style={styles.searchbar}
      />

      {loading && page === 1 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading appointments...
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: item.id })}
            />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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
  searchbar: {
    margin: SPACING.md,
    elevation: 2,
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
    paddingBottom: SPACING.lg,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    color: COLORS.textLight,
    textAlign: 'center',
  },
  footerLoader: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
});
