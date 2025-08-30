// Person model definition
export interface Person {
  id: string;
  name: string;
  label: string; // girlfriend/boyfriend, best friend, mom/dad, etc.
  image?: string; // URI to the person's image
  preferences?: string[]; // List of preferences/interests
  importantDates: ImportantDate[];
  giftIdeas: GiftIdea[];
  flowerSchedule?: FlowerSchedule;
}

export interface ImportantDate {
  id: string;
  type: 'birthday' | 'anniversary' | 'custom';
  name?: string; // For custom dates
  date: string; // ISO format date string (YYYY-MM-DD)
  reminderDays: number[]; // Days before to remind (e.g. [1, 7, 30])
}

export interface GiftIdea {
  id: string;
  name: string;
  description?: string;
  price?: number;
  occasion?: string; // e.g., "birthday", "anniversary", etc.
  url?: string; // Link to purchase
  isAiSuggested?: boolean;
  isPurchased?: boolean;
}

export interface FlowerSchedule {
  enableWomensDay: boolean; // March 8
  enableValentinesDay: boolean; // February 14
  enableBirthday: boolean;
  enableAnniversary: boolean;
  randomDates: number; // Number of random dates per month
  reminderDays: number[]; // Days before to remind (e.g. [1, 3, 7])
}
