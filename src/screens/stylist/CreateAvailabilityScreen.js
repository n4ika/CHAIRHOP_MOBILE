import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createAvailability } from '../../services/stylistAppointmentsService';
import Alert from '../../utils/Alert';
import { COLORS, SPACING } from '../../constants';

export default function CreateAvailabilityScreen({ navigation }) {
  // Initialize with tomorrow at 9 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState(tomorrow);
  const [location, setLocation] = useState('');
  const [services, setServices] = useState('');
  const [loading, setLoading] = useState(false);

  // For native platforms only
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // For web platform only
  const [dateString, setDateString] = useState(formatDateForInput(tomorrow));
  const [timeString, setTimeString] = useState('09:00');

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleCreate = async () => {
    // Validation
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    if (!services.trim()) {
      Alert.alert('Error', 'Please enter services offered');
      return;
    }

    let appointmentDateTime;

    if (Platform.OS === 'web') {
      // Web: combine date and time strings
      const dateTimeString = `${dateString}T${timeString}:00`;
      appointmentDateTime = new Date(dateTimeString);
    } else {
      // iOS/Android: combine date and time objects
      appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(time.getHours());
      appointmentDateTime.setMinutes(time.getMinutes());
    }

    // Check if date is in the past
    if (appointmentDateTime < new Date()) {
      Alert.alert('Error', 'Please select a future date and time');
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        time: appointmentDateTime.toISOString(),
        location: location.trim(),
        services: services.trim(),
      };

      await createAvailability(appointmentData);

      Alert.alert('Success!', 'Availability created', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.toString());
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeDisplay = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const onWebDateChange = (e) => {
    setDateString(e.target.value);
  };

  const onWebTimeChange = (e) => {
    setTimeString(e.target.value);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card} elevation={1}>
          <Text variant="headlineSmall" style={styles.title}>
            Create New Availability
          </Text>

          {/* Date Picker - Platform Specific */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Date
            </Text>
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={dateString}
                onChange={onWebDateChange}
                min={formatDateForInput(new Date())}
                style={{
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4,
                  backgroundColor: COLORS.background,
                  fontFamily: 'inherit',
                }}
              />
            ) : (
              <>
                <Button
                  mode="outlined"
                  onPress={() => setShowDatePicker(true)}
                  icon="calendar"
                  style={styles.pickerButton}
                  contentStyle={styles.pickerButtonContent}
                >
                  {formatDate(date)}
                </Button>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </>
            )}
          </View>

          {/* Time Picker - Platform Specific */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Time
            </Text>
            {Platform.OS === 'web' ? (
              <input
                type="time"
                value={timeString}
                onChange={onWebTimeChange}
                style={{
                  padding: 16,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4,
                  backgroundColor: COLORS.background,
                  fontFamily: 'inherit',
                }}
              />
            ) : (
              <>
                <Button
                  mode="outlined"
                  onPress={() => setShowTimePicker(true)}
                  icon="clock-outline"
                  style={styles.pickerButton}
                  contentStyle={styles.pickerButtonContent}
                >
                  {formatTime(time)}
                </Button>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                  />
                )}
              </>
            )}
          </View>

          {/* Location Input */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Location
            </Text>
            <TextInput
              mode="outlined"
              placeholder="e.g., Downtown Salon, 123 Main St"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
          </View>

          {/* Services Input */}
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>
              Services Offered
            </Text>
            <TextInput
              mode="outlined"
              placeholder="e.g., Haircut, Color, Styling"
              value={services}
              onChangeText={setServices}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <Text variant="bodySmall" style={styles.hint}>
              List the services you'll offer for this time slot
            </Text>
          </View>

          {/* Preview */}
          <Surface style={styles.preview} elevation={0}>
            <Text variant="labelMedium" style={styles.previewLabel}>
              Preview
            </Text>
            <Text variant="bodyMedium" style={styles.previewText}>
              📅 {Platform.OS === 'web'
                ? `${formatDateDisplay(dateString)} at ${formatTimeDisplay(timeString)}`
                : `${formatDate(date)} at ${formatTime(time)}`
              }
            </Text>
            {location.trim() && (
              <Text variant="bodyMedium" style={styles.previewText}>
                📍 {location}
              </Text>
            )}
            {services.trim() && (
              <Text variant="bodyMedium" style={styles.previewText}>
                ✨ {services}
              </Text>
            )}
          </Surface>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleCreate}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            Create Availability
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
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
  },
  pickerButton: {
    justifyContent: 'flex-start',
  },
  pickerButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  hint: {
    marginTop: SPACING.xs,
    color: COLORS.textLight,
  },
  preview: {
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  previewLabel: {
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    color: COLORS.textLight,
  },
  previewText: {
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  submitButtonContent: {
    paddingVertical: SPACING.sm,
  },
});
