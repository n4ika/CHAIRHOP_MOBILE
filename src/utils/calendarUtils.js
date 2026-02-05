import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import Alert from './Alert';

// Request calendar permissions
export const requestCalendarPermissions = async () => {
  if (Platform.OS === 'web') {
    Alert.alert('Not Available', 'Calendar sync is not available on web. Use the mobile app!');
    return false;
  }

  const { status } = await Calendar.requestCalendarPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Calendar access is needed to add appointments to your calendar.'
    );
    return false;
  }

  return true;
};

// Get or create app calendar
export const getAppCalendar = async () => {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

  // Look for existing ChairHop calendar
  const appCalendar = calendars.find(cal => cal.title === 'ChairHop');

  if (appCalendar) {
    return appCalendar.id;
  }

  // Create new calendar
  const defaultCalendar = calendars.find(
    cal => cal.allowsModifications && cal.isPrimary
  ) || calendars.find(cal => cal.allowsModifications);

  if (!defaultCalendar) {
    throw new Error('No writable calendar found');
  }

  const newCalendarId = await Calendar.createCalendarAsync({
    title: 'ChairHop',
    color: '#6200EE',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendar.source.id,
    source: defaultCalendar.source,
    name: 'ChairHop',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  return newCalendarId;
};

// Add appointment to calendar
export const addAppointmentToCalendar = async (appointment, userRole) => {
  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) return false;

    const calendarId = await getAppCalendar();

    const startDate = new Date(appointment.time);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour default

    const title = userRole === 'customer'
      ? `Haircut with ${appointment.stylist.name}`
      : `Appointment with ${appointment.customer?.name || 'Customer'}`;

    const notes = userRole === 'customer'
      ? `Service: ${appointment.selected_service}\nLocation: ${appointment.location}\nStylist: ${appointment.stylist.name}`
      : `Service: ${appointment.selected_service}\nLocation: ${appointment.location}\nCustomer: ${appointment.customer?.name || 'TBD'}`;

    const eventId = await Calendar.createEventAsync(calendarId, {
      title,
      startDate,
      endDate,
      location: appointment.location,
      notes,
      alarms: [{ relativeOffset: -60 }], // 1 hour before
    });

    return eventId;
  } catch (error) {
    console.error('Error adding to calendar:', error);
    Alert.alert('Error', 'Failed to add appointment to calendar');
    return false;
  }
};
