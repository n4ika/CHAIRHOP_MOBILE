import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { getConversation, sendMessage } from '../../services/messagingService';
import { COLORS, SPACING } from '../../constants';

export default function ChatScreen({ route }) {
  const { conversationId, otherUser } = route.params;
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== CHAT SCREEN USE EFFECT ===');
    console.log('Platform:', Platform.OS);
    console.log('Conversation ID:', conversationId);

    fetchMessages();

    // Use polling for all platforms (simple and reliable)
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000); // Poll every 3 seconds

    return () => {
      console.log('Cleaning up chat screen');
      clearInterval(interval);
    };
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const data = await getConversation(conversationId);

      // Transform messages to GiftedChat format
      const formattedMessages = data.conversation.messages.map((msg) => ({
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.sent_by_me ? user.id : otherUser.id,
          name: msg.sent_by_me ? user.name : otherUser.name,
        },
      })).reverse(); // GiftedChat expects newest first

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];

    try {
      await sendMessage(conversationId, message.text);
      // Message will appear via polling
      fetchMessages(); // Immediate refresh after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [conversationId]);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: COLORS.primary,
        },
        left: {
          backgroundColor: COLORS.card,
        },
      }}
      textStyle={{
        right: {
          color: '#FFFFFF',
        },
        left: {
          color: COLORS.text,
        },
      }}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <IconButton icon="send" iconColor={COLORS.primary} size={28} />
      </View>
    </Send>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user.id,
          name: user.name,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        alwaysShowSend
        scrollToBottom
        placeholder="Type a message..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
});
