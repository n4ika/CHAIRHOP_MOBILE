import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

export default function AppointmentCard({ appointment, onPress }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.accentBar} />
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.stylistName}>
              {appointment.stylist?.name || 'Stylist'}
            </Text>
            {appointment.stylist?.location && (
              <Text variant="bodySmall" style={styles.stylistLocation}>
                {appointment.stylist.location}
              </Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>📅</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {formatDate(appointment.time)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>🕐</Text>
            <Text variant="bodyMedium" style={styles.value}>
              {formatTime(appointment.time)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>📍</Text>
            <Text variant="bodyMedium" style={styles.value} numberOfLines={1}>
              {appointment.location}
            </Text>
          </View>

          {appointment.services_text && (
            <View style={styles.servicesContainer}>
              <Text variant="bodySmall" style={styles.servicesLabel}>
                Services:
              </Text>
              <Text variant="bodySmall" style={styles.servicesText} numberOfLines={2}>
                {appointment.services_text}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      },
    }),
  },
  accentBar: {
    height: 4,
    backgroundColor: COLORS.primary,
  },
  cardContent: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.md,
  },
  stylistName: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  stylistLocation: {
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    width: 30,
    color: COLORS.textLight,
  },
  value: {
    flex: 1,
    color: COLORS.text,
  },
  servicesContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  servicesLabel: {
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  servicesText: {
    color: COLORS.text,
  },
});
