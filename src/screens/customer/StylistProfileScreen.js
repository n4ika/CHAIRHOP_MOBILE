import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Surface, Divider, Avatar } from 'react-native-paper';
import { AirbnbRating } from 'react-native-ratings';
import { getStylistReviews } from '../../services/reviewsService';
import ReviewCardSkeleton from '../../components/skeletons/ReviewCardSkeleton';
import { COLORS, SPACING } from '../../constants';

export default function StylistProfileScreen({ route }) {
  const { stylist } = route.params;

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getStylistReviews(stylist.id);
      setReviews(data.reviews || []);
      setAverageRating(data.average_rating || 0);
      setTotalReviews(data.total_reviews || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderReview = ({ item }) => (
    <Surface style={styles.reviewCard} elevation={0}>
      <View style={styles.reviewHeader}>
        <Avatar.Text
          size={40}
          label={item.customer.name.charAt(0)}
          style={styles.avatar}
        />
        <View style={styles.reviewInfo}>
          <Text variant="titleSmall" style={styles.customerName}>
            {item.customer.name}
          </Text>
          <View style={styles.ratingRow}>
            <AirbnbRating
              count={5}
              defaultRating={item.rating}
              size={14}
              showRating={false}
              isDisabled
            />
            <Text variant="bodySmall" style={styles.reviewDate}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
      </View>
      <Text variant="bodyMedium" style={styles.reviewContent}>
        {item.content}
      </Text>
      <Text variant="bodySmall" style={styles.reviewService}>
        Service: {item.appointment.selected_service}
      </Text>
    </Surface>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stylist Info Card */}
        <Surface style={styles.profileCard} elevation={2}>
          <View style={styles.profileHeader}>
            <Avatar.Text
              size={80}
              label={stylist.name.charAt(0)}
              style={styles.profileAvatar}
            />
            <Text variant="headlineMedium" style={styles.stylistName}>
              {stylist.name}
            </Text>
            <Text variant="bodyMedium" style={styles.username}>
              @{stylist.username}
            </Text>
            {stylist.location && (
              <Text variant="bodyMedium" style={styles.location}>
                📍 {stylist.location}
              </Text>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Rating Summary */}
          <View style={styles.ratingSummary}>
            <Text variant="displaySmall" style={styles.averageRating}>
              {averageRating.toFixed(1)}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={averageRating}
              size={24}
              showRating={false}
              isDisabled
            />
            <Text variant="bodySmall" style={styles.totalReviews}>
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </Text>
          </View>
        </Surface>

        {/* Reviews List */}
        <View style={styles.reviewsSection}>
          <Text variant="titleLarge" style={styles.reviewsTitle}>
            Reviews
          </Text>

          {loading ? (
            <View>
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </View>
          ) : reviews.length === 0 ? (
            <Surface style={styles.emptyCard} elevation={0}>
              <Text variant="bodyMedium" style={styles.emptyText}>
                No reviews yet
              </Text>
            </Surface>
          ) : (
            <FlatList
              data={reviews}
              renderItem={renderReview}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
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
  profileCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileAvatar: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  stylistName: {
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  username: {
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  location: {
    color: COLORS.textLight,
  },
  divider: {
    marginVertical: SPACING.lg,
  },
  ratingSummary: {
    alignItems: 'center',
  },
  averageRating: {
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  totalReviews: {
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  reviewsSection: {
    marginTop: SPACING.md,
  },
  reviewsTitle: {
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textLight,
  },
  reviewCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border || '#e0e0e0',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  avatar: {
    backgroundColor: COLORS.primary + '80',
  },
  reviewInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  customerName: {
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  reviewDate: {
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  reviewContent: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  reviewService: {
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});
