// Reminder model definition
export interface Reminder {
  id: string;
  personId: string;
  personName: string; // For quick access without loading the full person
  title: string;
  description?: string;
  date: string; // ISO format date string (YYYY-MM-DD)
  type: 'gift' | 'flowers';
  isRead: boolean;
  notificationId?: string; // ID for the system notification
  calendarEventId?: string; // ID for Google Calendar event
}

export interface ReminderSettings {
  enablePushNotifications: boolean;
  enableCalendarNotifications: boolean;
  defaultReminderDays: number[]; // Default days before event to send reminder
  defaultFlowerReminderDays: number[];
}
