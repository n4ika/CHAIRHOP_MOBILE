import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { submitReview } from '../../services/reviewsService';
import Alert from '../../utils/Alert';
import { COLORS, SPACING } from '../../constants';

export default function LeaveReviewScreen({ route, navigation }) {
  const { appointmentId, stylistName, service } = route.params;

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write a review');
      return;
    }

    if (content.trim().length < 10) {
      Alert.alert('Error', 'Review must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      await submitReview(appointmentId, {
        rating,
        content: content.trim(),
      });

      Alert.alert('Success!', 'Thank you for your review!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MyBookings'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={1}>
          <Text variant="headlineSmall" style={styles.title}>
            How was your experience?
          </Text>

          <View style={styles.appointmentInfo}>
            <Text variant="bodyMedium" style={styles.stylistName}>
              {stylistName}
            </Text>
            <Text variant="bodySmall" style={styles.service}>
              {service}
            </Text>
          </View>

          {/* Star Rating */}
          <View style={styles.ratingContainer}>
            <Text variant="labelLarge" style={styles.label}>
              Rating
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={5}
              size={40}
              showRating={false}
              onFinishRating={setRating}
            />
          </View>

          {/* Review Text */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Your Review
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Tell us about your experience..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={5}
              style={styles.input}
            />
            <Text variant="bodySmall" style={styles.hint}>
              Minimum 10 characters ({content.length}/500)
            </Text>
          </View>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Submit Review
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderRadius: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    color: COLORS.text,
    textAlign: 'center',
  },
  appointmentInfo: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#e0e0e0',
  },
  stylistName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  service: {
    color: COLORS.textLight,
  },
  ratingContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.background,
  },
  hint: {
    marginTop: SPACING.xs,
    color: COLORS.textLight,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  submitButtonContent: {
    paddingVertical: SPACING.sm,
  },
});
