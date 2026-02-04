import { Alert as RNAlert, Platform } from 'react-native';

const Alert = {
  alert: (title, message, buttons) => {
    // On native mobile (iOS/Android), use React Native Alert
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      RNAlert.alert(title, message, buttons);
      return;
    }

    // On web/desktop, use browser dialogs
    if (buttons) {
      // If there are buttons with actions, handle them
      const buttonLabels = buttons.map(b => b.text).join(' / ');
      const result = window.confirm(`${title}\n\n${message}\n\n[${buttonLabels}]`);

      if (result) {
        // User clicked OK - find and execute the non-cancel button
        const confirmButton = buttons.find(b => b.style !== 'cancel');
        if (confirmButton && confirmButton.onPress) {
          confirmButton.onPress();
        }
      } else {
        // User clicked Cancel - find and execute the cancel button
        const cancelButton = buttons.find(b => b.style === 'cancel');
        if (cancelButton && cancelButton.onPress) {
          cancelButton.onPress();
        }
      }
    } else {
      // Simple alert with no buttons
      window.alert(`${title}\n\n${message}`);
    }
  }
};

export default Alert;
