import { Habit, HabitLog } from '../types/habit';
import { formatDateToYYYYMMDD, getDateString, getDaysInMonth } from './dateUtils';

// Local Storage Keys
const HABITS_STORAGE_KEY = 'habit-tracker-habits';
const HABIT_LOGS_STORAGE_KEY = 'habit-tracker-logs';

// Save habits to localStorage
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
};

// Load habits from localStorage
export const loadHabits = (): Habit[] => {
  const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
  return storedHabits ? JSON.parse(storedHabits) : [];
};

// Save habit logs to localStorage
export const saveHabitLogs = (logs: HabitLog[]): void => {
  localStorage.setItem(HABIT_LOGS_STORAGE_KEY, JSON.stringify(logs));
};

// Load habit logs from localStorage
export const loadHabitLogs = (): HabitLog[] => {
  const storedLogs = localStorage.getItem(HABIT_LOGS_STORAGE_KEY);
  return storedLogs ? JSON.parse(storedLogs) : [];
};

// Check if a habit is due on a specific date
export const isHabitDueOnDate = (habit: Habit, date: Date): boolean => {
  const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday

  if (habit.frequency === 'daily') {
    return true;
  }

  if (habit.frequency === 'weekly') {
    // Assume weekly means every Monday
    return dayOfWeek === 1;
  }

  if (habit.frequency === 'custom' && habit.customDays) {
    return habit.customDays.includes(dayOfWeek);
  }

  return false;
};

// Check if a habit is completed on a specific date
export const isHabitCompletedOnDate = (habit: Habit, logs: HabitLog[], date: Date): boolean => {
  const dateStr = formatDateToYYYYMMDD(date);
  const log = logs.find(log => log.habitId === habit.id && log.date === dateStr);
  return log ? log.completed : false;
};

// Calculate current streak for a habit
export const calculateStreak = (habit: Habit, logs: HabitLog[]): number => {
  let streak = 0;
  const today = new Date();
  let currentDate = new Date();

  // Start counting streak from today backwards
  while (true) {
    // If the habit is not due on this date, skip to the next day
    if (!isHabitDueOnDate(habit, currentDate)) {
      currentDate.setDate(currentDate.getDate() - 1);
      continue;
    }

    const dateStr = formatDateToYYYYMMDD(currentDate);
    const log = logs.find(log => log.habitId === habit.id && log.date === dateStr);

    // If there's no log or the habit was not completed, break the streak
    if (!log || !log.completed) {
      break;
    }

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);

    // Prevent infinite loops, limit to 365 days
    if (streak >= 365) break;
  }

  return streak;
};

// Calculate completion rate for a habit
export const calculateCompletionRate = (habit: Habit, logs: HabitLog[]): number => {
  // Get the creation date of the habit
  const creationDate = new Date(habit.createdAt);
  const today = new Date();

  // Count how many days the habit was due since its creation
  let dueCount = 0;
  let completedCount = 0;
  
  // Create a date iterator starting from creation date
  let currentDate = new Date(creationDate);
  
  // Loop until today
  while (currentDate <= today) {
    if (isHabitDueOnDate(habit, currentDate)) {
      dueCount++;
      
      const dateStr = formatDateToYYYYMMDD(currentDate);
      const log = logs.find(log => log.habitId === habit.id && log.date === dateStr);
      
      if (log && log.completed) {
        completedCount++;
      }
    }
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate the rate, avoiding division by zero
  return dueCount > 0 ? (completedCount / dueCount) * 100 : 0;
};

// Get all logs for a specific habit in a given month
export const getMonthlyLogs = (
  habit: Habit, 
  logs: HabitLog[], 
  year: number, 
  month: number
): Record<string, boolean> => {
  const result: Record<string, boolean> = {};
  const daysInMonth = getDaysInMonth(year, month);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = formatDateToYYYYMMDD(date);
    
    if (isHabitDueOnDate(habit, date)) {
      const log = logs.find(log => log.habitId === habit.id && log.date === dateString);
      result[dateString] = log ? log.completed : false;
    }
  }
  
  return result;
};

// Default habit colors
export const habitColors = [
  'bg-teal-500',
  'bg-purple-500',
  'bg-blue-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-indigo-500',
  'bg-rose-500'
];