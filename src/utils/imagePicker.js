import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import Alert from './Alert';

// Request camera permissions
export const requestCameraPermissions = async () => {
  if (Platform.OS === 'web') {
    return true;
  }

  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Camera access is needed to take photos.'
    );
    return false;
  }

  return true;
};

// Request media library permissions
export const requestMediaLibraryPermissions = async () => {
  if (Platform.OS === 'web') {
    return true;
  }

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Photo library access is needed to select photos.'
    );
    return false;
  }

  return true;
};

// Pick image from library
export const pickImageFromLibrary = async () => {
  const hasPermission = await requestMediaLibraryPermissions();

  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

// Take photo with camera
export const takePhoto = async () => {
  const hasPermission = await requestCameraPermissions();

  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }

  return null;
};

// Show image picker options
export const showImagePickerOptions = () => {
  return new Promise((resolve) => {
    Alert.alert(
      'Choose Photo',
      'Select a photo source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const uri = await takePhoto();
            resolve(uri);
          },
        },
        {
          text: 'Photo Library',
          onPress: async () => {
            const uri = await pickImageFromLibrary();
            resolve(uri);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ]
    );
  });
};
