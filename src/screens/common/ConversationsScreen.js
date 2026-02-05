import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Surface, Avatar, Badge } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getConversations } from '../../services/messagingService';
import { COLORS, SPACING } from '../../constants';

export default function ConversationsScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );

  const fetchConversations = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', {
        conversationId: item.id,
        otherUser: item.other_user,
      })}
    >
      <Surface style={styles.conversationCard} elevation={1}>
        <Avatar.Text
          size={50}
          label={item.other_user.name.charAt(0)}
          style={styles.avatar}
        />
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text variant="titleMedium" style={styles.userName}>
              {item.other_user.name}
            </Text>
            {item.last_message && (
              <Text variant="bodySmall" style={styles.time}>
                {formatTime(item.last_message.created_at)}
              </Text>
            )}
          </View>
          {item.last_message && (
            <Text
              variant="bodyMedium"
              style={[
                styles.lastMessage,
                item.unread_count > 0 && styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {item.last_message.sent_by_me ? 'You: ' : ''}
              {item.last_message.content}
            </Text>
          )}
        </View>
        {item.unread_count > 0 && (
          <Badge style={styles.badge}>{item.unread_count}</Badge>
        )}
      </Surface>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyIcon}>
        💬
      </Text>
      <Text variant="titleMedium" style={styles.emptyText}>
        No conversations yet
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtext}>
        Start chatting with stylists or customers
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchConversations(true)} />
        }
      />
    </View>
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
  listContent: {
    flexGrow: 1,
    padding: SPACING.sm,
  },
  conversationCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  conversationContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  userName: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  time: {
    color: COLORS.textLight,
  },
  lastMessage: {
    color: COLORS.textLight,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.primary,
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
