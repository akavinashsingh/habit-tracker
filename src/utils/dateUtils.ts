// Format date to YYYY-MM-DD string
export const formatDateToYYYYMMDD = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get the current date as a YYYY-MM-DD string
export const getDateString = (date = new Date()): string => {
  return formatDateToYYYYMMDD(date);
};

// Get the number of days in a month
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// Get an array of dates for a complete month
export const getDatesInMonth = (year: number, month: number): Date[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const dates: Date[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }
  
  return dates;
};

// Get day name abbreviation (e.g., 'Mon', 'Tue')
export const getDayNameAbbr = (date: Date): string => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Get month name
export const getMonthName = (month: number): string => {
  return new Date(2000, month, 1).toLocaleDateString('en-US', { month: 'long' });
};

// Compare two dates to check if they are the same day
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

// Create an array of week days (0 = Sunday, 1 = Monday, etc.)
export const getWeekDays = (startOnSunday = false): number[] => {
  if (startOnSunday) {
    return [0, 1, 2, 3, 4, 5, 6];
  }
  return [1, 2, 3, 4, 5, 6, 0]; // Start on Monday
};

// Get weekday names
export const getWeekdayNames = (abbreviated = true): string[] => {
  const format = abbreviated ? 'short' : 'long';
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(
      new Date(2000, 0, i + 2).toLocaleDateString('en-US', { weekday: format })
    );
  }
  return days;
};

// Add days to a date
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};