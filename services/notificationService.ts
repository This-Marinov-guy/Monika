/**
 * Service for handling notifications in the app
 * 
 * In a real app, this would use React Native's notification system
 * or a third-party library like react-native-notifications or expo-notifications
 */

import { Person } from '@/models/Person';
import { Reminder, ReminderSettings } from '@/models/Reminder';
import { daysUntil, formatDate } from '@/utils/dateUtils';

/**
 * Schedule a push notification for a specific date
 * 
 * @param title Notification title
 * @param body Notification body
 * @param date Date to schedule the notification for (ISO format)
 * @param id Unique identifier for the notification
 */
export async function scheduleNotification(
  title: string,
  body: string,
  date: string,
  id: string
): Promise<string> {
  // In a real app, this would use the device's notification system
  console.log(`Scheduling notification: ${title} for ${formatDate(date)}`);
  
  // Return a mock notification ID
  return `notification-${id}-${Date.now()}`;
}

/**
 * Cancel a scheduled notification
 * 
 * @param notificationId ID of the notification to cancel
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  // In a real app, this would cancel the notification using the device's notification system
  console.log(`Cancelling notification: ${notificationId}`);
}

/**
 * Add an event to Google Calendar
 * 
 * @param title Event title
 * @param description Event description
 * @param startDate Start date (ISO format)
 * @param reminders Array of minutes before event to remind
 */
export async function addToGoogleCalendar(
  title: string,
  description: string,
  startDate: string,
  reminders: number[] = [1440, 10080] // Default: 1 day and 1 week before (in minutes)
): Promise<string> {
  // In a real app, this would call the Google Calendar API
  console.log(`Adding to Google Calendar: ${title} on ${formatDate(startDate)}`);
  console.log(`With reminders at: ${reminders.join(', ')} minutes before`);
  
  // Return a mock event ID
  return `gcal-event-${Date.now()}`;
}

/**
 * Delete an event from Google Calendar
 * 
 * @param eventId Google Calendar event ID
 */
export async function deleteFromGoogleCalendar(eventId: string): Promise<void> {
  // In a real app, this would call the Google Calendar API
  console.log(`Removing from Google Calendar: ${eventId}`);
}

/**
 * Schedule reminders for a person's important dates based on settings
 * 
 * @param person The person to schedule reminders for
 * @param settings Notification settings
 */
export async function schedulePersonReminders(
  person: Person,
  settings: ReminderSettings
): Promise<Reminder[]> {
  const reminders: Reminder[] = [];
  
  // Process important dates
  for (const date of person.importantDates) {
    // Check if the date is in the future
    if (daysUntil(date.date) < 0) continue;
    
    const dateType = date.type === 'birthday' ? 'Birthday' : 
                    date.type === 'anniversary' ? 'Anniversary' : date.name || 'Event';
    
    // Create a reminder for the date itself
    const sameDayReminder: Reminder = {
      id: `reminder-${date.id}-0`,
      personId: person.id,
      personName: person.name,
      title: `${dateType} Today`,
      description: `Today is ${person.name}'s ${dateType.toLowerCase()}!`,
      date: date.date,
      type: 'gift',
      isRead: false
    };
    
    // Schedule push notification if enabled
    if (settings.enablePushNotifications) {
      sameDayReminder.notificationId = await scheduleNotification(
        sameDayReminder.title,
        sameDayReminder.description,
        date.date,
        sameDayReminder.id
      );
    }
    
    // Add to Google Calendar if enabled
    if (settings.enableCalendarNotifications) {
      const eventTitle = `${person.name}'s ${dateType}`;
      const reminderMinutes = date.reminderDays.map(days => days * 24 * 60); // Convert days to minutes
      
      const eventId = await addToGoogleCalendar(
        eventTitle,
        sameDayReminder.description,
        date.date,
        reminderMinutes
      );
      
      sameDayReminder.calendarEventId = eventId;
    }
    
    reminders.push(sameDayReminder);
    
    // Schedule reminders for days before the date
    for (const days of date.reminderDays) {
      const reminderDate = new Date(date.date);
      reminderDate.setDate(reminderDate.getDate() - days);
      
      const reminderDateStr = reminderDate.toISOString().split('T')[0];
      
      // Skip if the reminder date is in the past
      if (daysUntil(reminderDateStr) < 0) continue;
      
      const reminder: Reminder = {
        id: `reminder-${date.id}-${days}`,
        personId: person.id,
        personName: person.name,
        title: `${dateType} in ${days} ${days === 1 ? 'day' : 'days'}`,
        description: `${person.name}'s ${dateType.toLowerCase()} is coming up in ${days} ${days === 1 ? 'day' : 'days'}!`,
        date: reminderDateStr,
        type: 'gift',
        isRead: false
      };
      
      // Schedule push notification if enabled
      if (settings.enablePushNotifications) {
        reminder.notificationId = await scheduleNotification(
          reminder.title,
          reminder.description,
          reminderDateStr,
          reminder.id
        );
      }
      
      reminders.push(reminder);
    }
  }
  
  // Process flower schedule if it exists
  if (person.flowerSchedule) {
    // Logic for scheduling flower reminders would go here
    // Similar to the important dates logic above
    // This would include Women's Day, Valentine's Day, birthdays, anniversaries, and random dates
    
    // For demonstration purposes, we'll just add a sample flower reminder
    const flowerReminder: Reminder = {
      id: `flower-reminder-${person.id}`,
      personId: person.id,
      personName: person.name,
      title: 'Flowers Reminder',
      description: `Time to get flowers for ${person.name}!`,
      date: new Date().toISOString().split('T')[0], // Today's date
      type: 'flowers',
      isRead: false
    };
    
    // Schedule push notification if enabled
    if (settings.enablePushNotifications) {
      flowerReminder.notificationId = await scheduleNotification(
        flowerReminder.title,
        flowerReminder.description,
        flowerReminder.date,
        flowerReminder.id
      );
    }
    
    // Add to Google Calendar if enabled
    if (settings.enableCalendarNotifications) {
      const eventId = await addToGoogleCalendar(
        flowerReminder.title,
        flowerReminder.description,
        flowerReminder.date,
        [60, 1440] // 1 hour and 1 day before
      );
      
      flowerReminder.calendarEventId = eventId;
    }
    
    reminders.push(flowerReminder);
  }
  
  return reminders;
}

/**
 * Cancel all reminders for a person
 * 
 * @param reminders Array of reminders to cancel
 * @param settings Notification settings
 */
export async function cancelReminders(
  reminders: Reminder[],
  settings: ReminderSettings
): Promise<void> {
  for (const reminder of reminders) {
    // Cancel push notifications
    if (settings.enablePushNotifications && reminder.notificationId) {
      await cancelNotification(reminder.notificationId);
    }
    
    // Delete Google Calendar events
    if (settings.enableCalendarNotifications && reminder.calendarEventId) {
      await deleteFromGoogleCalendar(reminder.calendarEventId);
    }
  }
}