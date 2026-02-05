import { createConsumer } from '@rails/actioncable';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let cable = null;
let subscriptions = {};

// Initialize Action Cable connection
export const initializeCable = async () => {
  console.log('=== INITIALIZING ACTION CABLE ===');
  console.log('Platform:', Platform.OS);

  // Skip on web - WebSockets don't work reliably in browser
  if (Platform.OS === 'web') {
    console.log('Action Cable skipped on web (use polling instead)');
    return null;
  }

  if (cable) {
    console.log('Cable already exists, returning existing cable');
    return cable;
  }

  try {
    console.log('Fetching token from AsyncStorage...');
    const token = await AsyncStorage.getItem('userToken');
    console.log('Token retrieved:', token ? 'EXISTS' : 'NULL');

    if (!token) {
      console.log('No token found, cannot initialize cable');
      return null;
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');
    console.log('Clean token length:', cleanToken.length);

    // Connect to Action Cable with JWT token
    const wsUrl = `ws://localhost:3000/cable?token=${cleanToken}`;

    console.log('Connecting to Action Cable:', wsUrl);

    cable = createConsumer(wsUrl);

    console.log('Action Cable initialized successfully');
    console.log('Cable object:', cable);

    return cable;
  } catch (error) {
    console.error('!!! ERROR INITIALIZING ACTION CABLE !!!');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return null;
  }
};

// Subscribe to a conversation channel
export const subscribeToConversation = (conversationId, onMessageReceived) => {
  console.log('=== SUBSCRIBE TO CONVERSATION ===');
  console.log('Platform:', Platform.OS);
  console.log('Conversation ID:', conversationId);

  // Skip on web
  if (Platform.OS === 'web') {
    console.log('Skipping subscription on web');
    return null;
  }

  console.log('Cable status:', cable ? 'INITIALIZED' : 'NOT INITIALIZED');

  if (!cable) {
    console.error('!!! Cable not initialized - cannot subscribe !!!');
    return null;
  }

  // Check if already subscribed
  const subscriptionKey = `conversation_${conversationId}`;
  if (subscriptions[subscriptionKey]) {
    console.log('Already subscribed to conversation:', conversationId);
    return subscriptions[subscriptionKey];
  }

  console.log('Subscribing to conversation:', conversationId);

  const subscription = cable.subscriptions.create(
    {
      channel: 'ConversationChannel',
      conversation_id: conversationId,
    },
    {
      connected() {
        console.log('Connected to conversation:', conversationId);
      },
      disconnected() {
        console.log('Disconnected from conversation:', conversationId);
      },
      received(data) {
        console.log('Received message via Action Cable:', data);
        if (data.type === 'new_message') {
          onMessageReceived(data.message);
        }
      },
    }
  );

  subscriptions[subscriptionKey] = subscription;

  return subscription;
};

// Unsubscribe from a conversation
export const unsubscribeFromConversation = (conversationId) => {
  const subscriptionKey = `conversation_${conversationId}`;
  const subscription = subscriptions[subscriptionKey];

  if (subscription) {
    console.log('Unsubscribing from conversation:', conversationId);
    subscription.unsubscribe();
    delete subscriptions[subscriptionKey];
  }
};

// Disconnect from Action Cable
export const disconnectCable = () => {
  if (cable) {
    console.log('Disconnecting from Action Cable');
    cable.disconnect();
    cable = null;
    subscriptions = {};
  }
};
