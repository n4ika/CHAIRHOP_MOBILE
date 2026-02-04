import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
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
      <Card style={styles.card}>
        <Card.Content>
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
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    elevation: 2,
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
