/**
 * Utility functions for date handling in the app
 */

/**
 * Generates random dates for flower gifts
 * 
 * @param count Number of random dates to generate per month
 * @param year Year to generate dates for
 * @returns Array of ISO format date strings (YYYY-MM-DD)
 */
export function generateRandomFlowerDates(count: number, year: number = new Date().getFullYear()): string[] {
  const dates: string[] = [];
  
  for (let month = 0; month < 12; month++) {
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Generate random days for this month
    const randomDays = generateUniqueRandomNumbers(1, daysInMonth, Math.min(count, daysInMonth));
    
    // Create date strings
    for (const day of randomDays) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      dates.push(`${year}-${monthStr}-${dayStr}`);
    }
  }
  
  return dates;
}

/**
 * Generates unique random numbers within a range
 * 
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @param count Number of unique values to generate
 * @returns Array of unique random numbers
 */
function generateUniqueRandomNumbers(min: number, max: number, count: number): number[] {
  if (max - min + 1 < count) {
    throw new Error('Range is too small to generate unique numbers');
  }
  
  const numbers: Set<number> = new Set();
  
  while (numbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNumber);
  }
  
  return Array.from(numbers);
}

/**
 * Formats a date string in a user-friendly format
 * 
 * @param dateStr ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "January 1, 2023")
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculates days until a specified date
 * 
 * @param dateStr ISO date string (YYYY-MM-DD)
 * @returns Number of days until the date
 */
export function daysUntil(dateStr: string): number {
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Gets the Women's Day date for a given year
 * 
 * @param year Year to get the Women's Day date for
 * @returns ISO format date string (YYYY-MM-DD)
 */
export function getWomensDayDate(year: number = new Date().getFullYear()): string {
  return `${year}-03-08`; // March 8
}

/**
 * Gets the Valentine's Day date for a given year
 * 
 * @param year Year to get the Valentine's Day date for
 * @returns ISO format date string (YYYY-MM-DD)
 */
export function getValentinesDayDate(year: number = new Date().getFullYear()): string {
  return `${year}-02-14`; // February 14
}
