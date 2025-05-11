export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[];
  createdAt: string;
  color: string;
  archived: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  logs: HabitLog[];
}

export type SortOption = 'name' | 'streak' | 'completion' | 'created';
export type FilterOption = 'all' | 'active' | 'archived';