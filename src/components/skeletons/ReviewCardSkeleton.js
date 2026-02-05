import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Surface } from 'react-native-paper';
import { COLORS, SPACING } from '../../constants';

export default function ReviewCardSkeleton() {
  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  loading: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
