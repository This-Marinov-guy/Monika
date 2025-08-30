import { createClient } from '@supabase/supabase-js';

// These values should be stored in environment variables in a real app
const SUPABASE_URL = 'https://your-supabase-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Use this to create proper TypeScript types for your database tables
 * Make sure these match your Supabase schema
 */
export type Database = {
  public: {
    tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          updated_at?: string;
        };
      };
      persons: {
        Row: {
          id: string;
          name: string;
          label: string;
          image_url: string | null;
          preferences: string[] | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          label: string;
          image_url?: string | null;
          preferences?: string[] | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          label?: string;
          image_url?: string | null;
          preferences?: string[] | null;
          updated_at?: string;
        };
      };
      important_dates: {
        Row: {
          id: string;
          type: string;
          name: string | null;
          date: string;
          reminder_days: number[];
          person_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          name?: string | null;
          date: string;
          reminder_days: number[];
          person_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: string;
          name?: string | null;
          date?: string;
          reminder_days?: number[];
          updated_at?: string;
        };
      };
      gift_ideas: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          occasion: string | null;
          url: string | null;
          is_ai_suggested: boolean;
          is_purchased: boolean;
          person_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          occasion?: string | null;
          url?: string | null;
          is_ai_suggested?: boolean;
          is_purchased?: boolean;
          person_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number | null;
          occasion?: string | null;
          url?: string | null;
          is_ai_suggested?: boolean;
          is_purchased?: boolean;
          updated_at?: string;
        };
      };
      flower_schedules: {
        Row: {
          id: string;
          enable_womens_day: boolean;
          enable_valentines_day: boolean;
          enable_birthday: boolean;
          enable_anniversary: boolean;
          random_dates: number;
          reminder_days: number[];
          person_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enable_womens_day: boolean;
          enable_valentines_day: boolean;
          enable_birthday: boolean;
          enable_anniversary: boolean;
          random_dates: number;
          reminder_days: number[];
          person_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          enable_womens_day?: boolean;
          enable_valentines_day?: boolean;
          enable_birthday?: boolean;
          enable_anniversary?: boolean;
          random_dates?: number;
          reminder_days?: number[];
          updated_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          date: string;
          type: string;
          is_read: boolean;
          notification_id: string | null;
          calendar_event_id: string | null;
          person_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          date: string;
          type: string;
          is_read?: boolean;
          notification_id?: string | null;
          calendar_event_id?: string | null;
          person_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          date?: string;
          type?: string;
          is_read?: boolean;
          notification_id?: string | null;
          calendar_event_id?: string | null;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          enable_push_notifications: boolean;
          enable_calendar_notifications: boolean;
          default_reminder_days: number[];
          default_flower_reminder_days: number[];
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enable_push_notifications?: boolean;
          enable_calendar_notifications?: boolean;
          default_reminder_days?: number[];
          default_flower_reminder_days?: number[];
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          enable_push_notifications?: boolean;
          enable_calendar_notifications?: boolean;
          default_reminder_days?: number[];
          default_flower_reminder_days?: number[];
          updated_at?: string;
        };
      };
    };
  };
};
