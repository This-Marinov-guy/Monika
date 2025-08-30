# Monika - Gift & Flower Assistant

Monika is a personal assistant app to help you remember important dates, manage gift ideas, and schedule flowers for the people you care about.

## Features

- **People Catalogue**: Keep track of people in your life with their preferences and important dates
- **Gift Management**: Store gift ideas for each person and get AI-powered suggestions
- **Flower Scheduling**: Schedule flowers for important dates and random occasions
- **Notifications**: Get reminders for upcoming events through push notifications and Google Calendar
- **Authentication**: Secure user accounts with email/password and Google OAuth
- **Database**: PostgreSQL database with Supabase for storage and authentication

## Tech Stack

- **Frontend**: React Native with Expo
- **Styling**: Custom design system based on Mabel Mobile Design System
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Notifications**: Expo Notifications + Google Calendar API

## Setup Instructions

### Prerequisites

- Node.js v14+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account (for backend)

### Environment Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Supabase project at [supabase.com](https://supabase.com)
4. Set up your Supabase URL and anon key in `services/supabaseClient.ts`:
   ```typescript
   const SUPABASE_URL = 'your-supabase-project-url';
   const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
   ```

### Database Setup

1. Run the database migration script in the Supabase SQL editor:
   - Copy the contents of `db/migrations/001_create_initial_schema.sql`
   - Paste into Supabase SQL editor and execute

2. Enable the required OAuth providers in Supabase:
   - Go to Authentication > Providers
   - Enable Email/Password and Google OAuth
   - Configure Google OAuth with required scopes for Google Calendar

### Running the App

Start the development server:
```bash
npm start
```

This will open Expo Developer Tools where you can run the app on:
- iOS simulator (macOS only)
- Android emulator
- Physical device using the Expo Go app
- Web browser (limited functionality)

## Project Structure

- `app/` - Application screens using Expo Router
  - `(tabs)/` - Main tab screens
  - `auth/` - Authentication screens
- `components/` - Reusable UI components
- `constants/` - App constants including colors
- `context/` - React context providers (Auth)
- `db/` - Database migrations and schemas
- `hooks/` - Custom React hooks
- `models/` - TypeScript interfaces for data models
- `services/` - API and database services
- `utils/` - Utility functions

## Authentication and Security

The app implements a secure authentication flow with:
- Email/password authentication
- Password reset functionality
- Google OAuth integration
- Protected routes for authenticated users
- Row-level security in the database

## Data Model

The database schema includes the following tables:
- `users` - User accounts (managed by Supabase Auth)
- `persons` - People in the user's catalogue
- `important_dates` - Birthdays, anniversaries, and custom dates
- `gift_ideas` - Gift ideas for each person
- `flower_schedules` - Flower scheduling preferences for each person
- `reminders` - Upcoming reminders for gifts and flowers
- `user_settings` - User preferences for notifications

## License

This project is licensed under the MIT License - see the LICENSE file for details.