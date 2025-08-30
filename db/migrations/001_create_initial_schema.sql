-- Migration 001: Create initial schema for Monika app
-- Note: The users table is already assumed to exist in public.users

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create persons table
CREATE TABLE IF NOT EXISTS public.persons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  image_url TEXT,
  preferences TEXT[],
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create important_dates table
CREATE TABLE IF NOT EXISTS public.important_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('birthday', 'anniversary', 'custom')),
  name TEXT,
  date DATE NOT NULL,
  reminder_days INTEGER[] NOT NULL DEFAULT '{1,7,30}',
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create gift_ideas table
CREATE TABLE IF NOT EXISTS public.gift_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  occasion TEXT,
  url TEXT,
  is_ai_suggested BOOLEAN NOT NULL DEFAULT FALSE,
  is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create flower_schedules table
CREATE TABLE IF NOT EXISTS public.flower_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enable_womens_day BOOLEAN NOT NULL DEFAULT TRUE,
  enable_valentines_day BOOLEAN NOT NULL DEFAULT TRUE,
  enable_birthday BOOLEAN NOT NULL DEFAULT TRUE,
  enable_anniversary BOOLEAN NOT NULL DEFAULT TRUE,
  random_dates INTEGER NOT NULL DEFAULT 0,
  reminder_days INTEGER[] NOT NULL DEFAULT '{1,3}',
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_person_flower_schedule UNIQUE (person_id)
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gift', 'flowers')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  notification_id TEXT,
  calendar_event_id TEXT,
  person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enable_push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  enable_calendar_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  default_reminder_days INTEGER[] NOT NULL DEFAULT '{1,7,30}',
  default_flower_reminder_days INTEGER[] NOT NULL DEFAULT '{1,3}',
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_persons_user_id ON public.persons(user_id);
CREATE INDEX IF NOT EXISTS idx_important_dates_person_id ON public.important_dates(person_id);
CREATE INDEX IF NOT EXISTS idx_gift_ideas_person_id ON public.gift_ideas(person_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_person_id ON public.reminders(person_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(date);

-- Create update_updated_at function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at timestamp
CREATE TRIGGER set_persons_updated_at
BEFORE UPDATE ON public.persons
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_important_dates_updated_at
BEFORE UPDATE ON public.important_dates
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_gift_ideas_updated_at
BEFORE UPDATE ON public.gift_ideas
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_flower_schedules_updated_at
BEFORE UPDATE ON public.flower_schedules
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_reminders_updated_at
BEFORE UPDATE ON public.reminders
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Set up row-level security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.important_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flower_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for persons table
CREATE POLICY persons_select_policy ON public.persons
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY persons_insert_policy ON public.persons
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY persons_update_policy ON public.persons
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY persons_delete_policy ON public.persons
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for important_dates table
CREATE POLICY important_dates_select_policy ON public.important_dates
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.important_dates.person_id
    AND public.persons.user_id = auth.uid()
  ));
  
CREATE POLICY important_dates_insert_policy ON public.important_dates
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.important_dates.person_id
    AND public.persons.user_id = auth.uid()
  ));
  
CREATE POLICY important_dates_update_policy ON public.important_dates
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.important_dates.person_id
    AND public.persons.user_id = auth.uid()
  ));
  
CREATE POLICY important_dates_delete_policy ON public.important_dates
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.important_dates.person_id
    AND public.persons.user_id = auth.uid()
  ));

-- Create similar policies for other tables
-- For brevity, just showing gift_ideas policies as example:
CREATE POLICY gift_ideas_select_policy ON public.gift_ideas
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.gift_ideas.person_id
    AND public.persons.user_id = auth.uid()
  ));
  
CREATE POLICY gift_ideas_insert_policy ON public.gift_ideas
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.gift_ideas.person_id
    AND public.persons.user_id = auth.uid()
  ));
  
CREATE POLICY gift_ideas_update_policy ON public.gift_ideas
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.gift_ideas.person_id
    AND public.persons.user_id = auth.uid()
  ));
  
CREATE POLICY gift_ideas_delete_policy ON public.gift_ideas
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.persons 
    WHERE public.persons.id = public.gift_ideas.person_id
    AND public.persons.user_id = auth.uid()
  ));

-- User settings policies
CREATE POLICY user_settings_select_policy ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY user_settings_insert_policy ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY user_settings_update_policy ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY user_settings_delete_policy ON public.user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Reminders policies
CREATE POLICY reminders_select_policy ON public.reminders
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY reminders_insert_policy ON public.reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY reminders_update_policy ON public.reminders
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY reminders_delete_policy ON public.reminders
  FOR DELETE USING (auth.uid() = user_id);
