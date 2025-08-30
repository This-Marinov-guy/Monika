import { FlowerSchedule, GiftIdea, ImportantDate, Person } from '@/models/Person';
import { Reminder, ReminderSettings } from '@/models/Reminder';
import { Database, supabase } from './supabaseClient';

/**
 * Service for interacting with the database
 */

// Type definitions for mapping database types to model types
type DBPerson = Database['public']['tables']['persons']['Row'];
type DBImportantDate = Database['public']['tables']['important_dates']['Row'];
type DBGiftIdea = Database['public']['tables']['gift_ideas']['Row'];
type DBFlowerSchedule = Database['public']['tables']['flower_schedules']['Row'];
type DBReminder = Database['public']['tables']['reminders']['Row'];
type DBUserSettings = Database['public']['tables']['user_settings']['Row'];

// Mapping functions for converting DB types to model types
function mapDBPersonToPerson(dbPerson: DBPerson): Person {
  return {
    id: dbPerson.id,
    name: dbPerson.name,
    label: dbPerson.label,
    image: dbPerson.image_url || undefined,
    preferences: dbPerson.preferences || [],
    importantDates: [], // To be populated separately
    giftIdeas: [], // To be populated separately
    // flowerSchedule will be populated separately
  };
}

function mapDBImportantDateToImportantDate(dbDate: DBImportantDate): ImportantDate {
  return {
    id: dbDate.id,
    type: dbDate.type as 'birthday' | 'anniversary' | 'custom',
    name: dbDate.name || undefined,
    date: dbDate.date,
    reminderDays: dbDate.reminder_days,
  };
}

function mapDBGiftIdeaToGiftIdea(dbGift: DBGiftIdea): GiftIdea {
  return {
    id: dbGift.id,
    name: dbGift.name,
    description: dbGift.description || undefined,
    price: dbGift.price !== null ? Number(dbGift.price) : undefined,
    occasion: dbGift.occasion || undefined,
    url: dbGift.url || undefined,
    isAiSuggested: dbGift.is_ai_suggested,
    isPurchased: dbGift.is_purchased,
  };
}

function mapDBFlowerScheduleToFlowerSchedule(dbSchedule: DBFlowerSchedule): FlowerSchedule {
  return {
    enableWomensDay: dbSchedule.enable_womens_day,
    enableValentinesDay: dbSchedule.enable_valentines_day,
    enableBirthday: dbSchedule.enable_birthday,
    enableAnniversary: dbSchedule.enable_anniversary,
    randomDates: dbSchedule.random_dates,
    reminderDays: dbSchedule.reminder_days,
  };
}

function mapDBReminderToReminder(dbReminder: DBReminder): Reminder {
  return {
    id: dbReminder.id,
    personId: dbReminder.person_id,
    personName: '', // Will need to be populated separately
    title: dbReminder.title,
    description: dbReminder.description || undefined,
    date: dbReminder.date,
    type: dbReminder.type as 'gift' | 'flowers',
    isRead: dbReminder.is_read,
    notificationId: dbReminder.notification_id || undefined,
    calendarEventId: dbReminder.calendar_event_id || undefined,
  };
}

function mapDBUserSettingsToReminderSettings(dbSettings: DBUserSettings): ReminderSettings {
  return {
    enablePushNotifications: dbSettings.enable_push_notifications,
    enableCalendarNotifications: dbSettings.enable_calendar_notifications,
    defaultReminderDays: dbSettings.default_reminder_days,
    defaultFlowerReminderDays: dbSettings.default_flower_reminder_days,
  };
}

// CRUD operations for Persons

/**
 * Get all persons for the current user
 */
export async function getPersons(): Promise<Person[]> {
  const { data: persons, error } = await supabase
    .from('persons')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    throw error;
  }
  
  const mappedPersons = persons.map(mapDBPersonToPerson);
  
  // For each person, load their important dates, gift ideas, and flower schedule
  for (const person of mappedPersons) {
    person.importantDates = await getImportantDates(person.id);
    person.giftIdeas = await getGiftIdeas(person.id);
    person.flowerSchedule = await getFlowerSchedule(person.id);
  }
  
  return mappedPersons;
}

/**
 * Get a person by ID
 * @param id Person ID
 */
export async function getPerson(id: string): Promise<Person | null> {
  const { data: person, error } = await supabase
    .from('persons')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    throw error;
  }
  
  if (!person) {
    return null;
  }
  
  const mappedPerson = mapDBPersonToPerson(person);
  
  // Load related data
  mappedPerson.importantDates = await getImportantDates(id);
  mappedPerson.giftIdeas = await getGiftIdeas(id);
  mappedPerson.flowerSchedule = await getFlowerSchedule(id);
  
  return mappedPerson;
}

/**
 * Create a new person
 * @param person Person data to create
 */
export async function createPerson(person: Omit<Person, 'id' | 'importantDates' | 'giftIdeas' | 'flowerSchedule'>): Promise<Person> {
  const { data: user } = await supabase.auth.getUser();
  
  const { data: createdPerson, error } = await supabase
    .from('persons')
    .insert({
      name: person.name,
      label: person.label,
      image_url: person.image,
      preferences: person.preferences,
      user_id: user.user!.id,
    })
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  const mappedPerson = mapDBPersonToPerson(createdPerson);
  mappedPerson.importantDates = [];
  mappedPerson.giftIdeas = [];
  
  return mappedPerson;
}

/**
 * Update an existing person
 * @param id Person ID
 * @param person Updated person data
 */
export async function updatePerson(id: string, person: Partial<Person>): Promise<Person> {
  const { data: updatedPerson, error } = await supabase
    .from('persons')
    .update({
      name: person.name,
      label: person.label,
      image_url: person.image,
      preferences: person.preferences,
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  const mappedPerson = mapDBPersonToPerson(updatedPerson);
  
  // Load related data
  mappedPerson.importantDates = await getImportantDates(id);
  mappedPerson.giftIdeas = await getGiftIdeas(id);
  mappedPerson.flowerSchedule = await getFlowerSchedule(id);
  
  return mappedPerson;
}

/**
 * Delete a person
 * @param id Person ID
 */
export async function deletePerson(id: string): Promise<void> {
  const { error } = await supabase
    .from('persons')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}

// CRUD operations for Important Dates

/**
 * Get all important dates for a person
 * @param personId Person ID
 */
export async function getImportantDates(personId: string): Promise<ImportantDate[]> {
  const { data: dates, error } = await supabase
    .from('important_dates')
    .select('*')
    .eq('person_id', personId)
    .order('date');
    
  if (error) {
    throw error;
  }
  
  return dates.map(mapDBImportantDateToImportantDate);
}

/**
 * Create a new important date for a person
 * @param personId Person ID
 * @param date Important date data
 */
export async function createImportantDate(personId: string, date: Omit<ImportantDate, 'id'>): Promise<ImportantDate> {
  const { data: createdDate, error } = await supabase
    .from('important_dates')
    .insert({
      type: date.type,
      name: date.name,
      date: date.date,
      reminder_days: date.reminderDays,
      person_id: personId,
    })
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return mapDBImportantDateToImportantDate(createdDate);
}

/**
 * Update an existing important date
 * @param id Important date ID
 * @param date Updated important date data
 */
export async function updateImportantDate(id: string, date: Partial<ImportantDate>): Promise<ImportantDate> {
  const { data: updatedDate, error } = await supabase
    .from('important_dates')
    .update({
      type: date.type,
      name: date.name,
      date: date.date,
      reminder_days: date.reminderDays,
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return mapDBImportantDateToImportantDate(updatedDate);
}

/**
 * Delete an important date
 * @param id Important date ID
 */
export async function deleteImportantDate(id: string): Promise<void> {
  const { error } = await supabase
    .from('important_dates')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}

// CRUD operations for Gift Ideas

/**
 * Get all gift ideas for a person
 * @param personId Person ID
 */
export async function getGiftIdeas(personId: string): Promise<GiftIdea[]> {
  const { data: gifts, error } = await supabase
    .from('gift_ideas')
    .select('*')
    .eq('person_id', personId);
    
  if (error) {
    throw error;
  }
  
  return gifts.map(mapDBGiftIdeaToGiftIdea);
}

/**
 * Create a new gift idea for a person
 * @param personId Person ID
 * @param gift Gift idea data
 */
export async function createGiftIdea(personId: string, gift: Omit<GiftIdea, 'id'>): Promise<GiftIdea> {
  const { data: createdGift, error } = await supabase
    .from('gift_ideas')
    .insert({
      name: gift.name,
      description: gift.description,
      price: gift.price,
      occasion: gift.occasion,
      url: gift.url,
      is_ai_suggested: gift.isAiSuggested || false,
      is_purchased: gift.isPurchased || false,
      person_id: personId,
    })
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return mapDBGiftIdeaToGiftIdea(createdGift);
}

/**
 * Update an existing gift idea
 * @param id Gift idea ID
 * @param gift Updated gift idea data
 */
export async function updateGiftIdea(id: string, gift: Partial<GiftIdea>): Promise<GiftIdea> {
  const { data: updatedGift, error } = await supabase
    .from('gift_ideas')
    .update({
      name: gift.name,
      description: gift.description,
      price: gift.price,
      occasion: gift.occasion,
      url: gift.url,
      is_ai_suggested: gift.isAiSuggested,
      is_purchased: gift.isPurchased,
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return mapDBGiftIdeaToGiftIdea(updatedGift);
}

/**
 * Delete a gift idea
 * @param id Gift idea ID
 */
export async function deleteGiftIdea(id: string): Promise<void> {
  const { error } = await supabase
    .from('gift_ideas')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}

// CRUD operations for Flower Schedules

/**
 * Get a flower schedule for a person
 * @param personId Person ID
 */
export async function getFlowerSchedule(personId: string): Promise<FlowerSchedule | undefined> {
  const { data: schedule, error } = await supabase
    .from('flower_schedules')
    .select('*')
    .eq('person_id', personId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return undefined;
    }
    throw error;
  }
  
  if (!schedule) {
    return undefined;
  }
  
  return mapDBFlowerScheduleToFlowerSchedule(schedule);
}

/**
 * Create or update a flower schedule for a person
 * @param personId Person ID
 * @param schedule Flower schedule data
 */
export async function saveFlowerSchedule(personId: string, schedule: FlowerSchedule): Promise<FlowerSchedule> {
  // Check if schedule exists first
  const existingSchedule = await getFlowerSchedule(personId);
  
  if (existingSchedule) {
    // Update existing schedule
    const { data: updatedSchedule, error } = await supabase
      .from('flower_schedules')
      .update({
        enable_womens_day: schedule.enableWomensDay,
        enable_valentines_day: schedule.enableValentinesDay,
        enable_birthday: schedule.enableBirthday,
        enable_anniversary: schedule.enableAnniversary,
        random_dates: schedule.randomDates,
        reminder_days: schedule.reminderDays,
      })
      .eq('person_id', personId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return mapDBFlowerScheduleToFlowerSchedule(updatedSchedule);
  } else {
    // Create new schedule
    const { data: createdSchedule, error } = await supabase
      .from('flower_schedules')
      .insert({
        enable_womens_day: schedule.enableWomensDay,
        enable_valentines_day: schedule.enableValentinesDay,
        enable_birthday: schedule.enableBirthday,
        enable_anniversary: schedule.enableAnniversary,
        random_dates: schedule.randomDates,
        reminder_days: schedule.reminderDays,
        person_id: personId,
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return mapDBFlowerScheduleToFlowerSchedule(createdSchedule);
  }
}

// CRUD operations for Reminders

/**
 * Get all reminders for the current user
 */
export async function getReminders(): Promise<Reminder[]> {
  const { data: user } = await supabase.auth.getUser();
  
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*, persons!inner(name)')
    .eq('user_id', user.user!.id)
    .order('date');
    
  if (error) {
    throw error;
  }
  
  return reminders.map((reminder) => {
    const mappedReminder = mapDBReminderToReminder(reminder);
    mappedReminder.personName = (reminder as any).persons.name;
    return mappedReminder;
  });
}

/**
 * Create a new reminder
 * @param reminder Reminder data
 */
export async function createReminder(reminder: Omit<Reminder, 'id' | 'isRead'>): Promise<Reminder> {
  const { data: user } = await supabase.auth.getUser();
  
  const { data: createdReminder, error } = await supabase
    .from('reminders')
    .insert({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      type: reminder.type,
      notification_id: reminder.notificationId,
      calendar_event_id: reminder.calendarEventId,
      person_id: reminder.personId,
      user_id: user.user!.id,
    })
    .select('*, persons!inner(name)')
    .single();
    
  if (error) {
    throw error;
  }
  
  const mappedReminder = mapDBReminderToReminder(createdReminder);
  mappedReminder.personName = (createdReminder as any).persons.name;
  
  return mappedReminder;
}

/**
 * Update an existing reminder
 * @param id Reminder ID
 * @param reminder Updated reminder data
 */
export async function updateReminder(id: string, reminder: Partial<Reminder>): Promise<Reminder> {
  const { data: updatedReminder, error } = await supabase
    .from('reminders')
    .update({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      type: reminder.type,
      is_read: reminder.isRead,
      notification_id: reminder.notificationId,
      calendar_event_id: reminder.calendarEventId,
    })
    .eq('id', id)
    .select('*, persons!inner(name)')
    .single();
    
  if (error) {
    throw error;
  }
  
  const mappedReminder = mapDBReminderToReminder(updatedReminder);
  mappedReminder.personName = (updatedReminder as any).persons.name;
  
  return mappedReminder;
}

/**
 * Mark a reminder as read
 * @param id Reminder ID
 */
export async function markReminderAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('reminders')
    .update({
      is_read: true,
    })
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}

/**
 * Delete a reminder
 * @param id Reminder ID
 */
export async function deleteReminder(id: string): Promise<void> {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id);
    
  if (error) {
    throw error;
  }
}

// CRUD operations for User Settings

/**
 * Get the current user's settings
 */
export async function getUserSettings(): Promise<ReminderSettings> {
  const { data: user } = await supabase.auth.getUser();
  
  const { data: settings, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.user!.id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      // Create default settings
      const defaultSettings: ReminderSettings = {
        enablePushNotifications: true,
        enableCalendarNotifications: false,
        defaultReminderDays: [1, 7, 30],
        defaultFlowerReminderDays: [1, 3],
      };
      
      return saveUserSettings(defaultSettings);
    }
    throw error;
  }
  
  return mapDBUserSettingsToReminderSettings(settings);
}

/**
 * Save the current user's settings
 * @param settings Settings data
 */
export async function saveUserSettings(settings: ReminderSettings): Promise<ReminderSettings> {
  const { data: user } = await supabase.auth.getUser();
  
  // Try to get existing settings
  const { data: existingSettings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.user!.id)
    .single();
    
  if (existingSettings) {
    // Update existing settings
    const { data: updatedSettings, error } = await supabase
      .from('user_settings')
      .update({
        enable_push_notifications: settings.enablePushNotifications,
        enable_calendar_notifications: settings.enableCalendarNotifications,
        default_reminder_days: settings.defaultReminderDays,
        default_flower_reminder_days: settings.defaultFlowerReminderDays,
      })
      .eq('user_id', user.user!.id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return mapDBUserSettingsToReminderSettings(updatedSettings);
  } else {
    // Create new settings
    const { data: createdSettings, error } = await supabase
      .from('user_settings')
      .insert({
        enable_push_notifications: settings.enablePushNotifications,
        enable_calendar_notifications: settings.enableCalendarNotifications,
        default_reminder_days: settings.defaultReminderDays,
        default_flower_reminder_days: settings.defaultFlowerReminderDays,
        user_id: user.user!.id,
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return mapDBUserSettingsToReminderSettings(createdSettings);
  }
}
