import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface, Avatar, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { uploadAvatar } from '../../services/uploadService';
import { showImagePickerOptions } from '../../utils/imagePicker';
import Alert from '../../utils/Alert';
import { COLORS, SPACING } from '../../constants';

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [avatarUri, setAvatarUri] = useState(user?.avatar_url);

  const handleUploadAvatar = async () => {
    const imageUri = await showImagePickerOptions();

    if (!imageUri) return;

    try {
      setUploading(true);
      const data = await uploadAvatar(imageUri);

      setAvatarUri(data.avatar_url);

      // Update user in context
      setUser({ ...user, avatar_url: data.avatar_url });

      Alert.alert('Success', 'Profile photo updated!');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.toString());
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={2}>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Avatar.Text
              size={120}
              label={user?.name?.charAt(0) || '?'}
              style={styles.avatarPlaceholder}
            />
          )}

          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        </View>

        <Button
          mode="outlined"
          onPress={handleUploadAvatar}
          style={styles.uploadButton}
          icon="camera"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Change Photo'}
        </Button>

        <View style={styles.infoSection}>
          <Text variant="headlineSmall" style={styles.name}>
            {user?.name}
          </Text>
          <Text variant="bodyMedium" style={styles.username}>
            @{user?.username}
          </Text>
          <Text variant="bodyMedium" style={styles.location}>
            {user?.location}
          </Text>
          <Text variant="bodyMedium" style={styles.role}>
            Role: {user?.role}
          </Text>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  card: {
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    marginBottom: SPACING.lg,
  },
  infoSection: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  username: {
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  location: {
    marginBottom: SPACING.xs,
  },
  role: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
