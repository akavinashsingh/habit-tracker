import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Habit, HabitLog, HabitWithStats, SortOption, FilterOption } from '../types/habit';
import { 
  saveHabits, 
  loadHabits, 
  saveHabitLogs, 
  loadHabitLogs, 
  calculateStreak, 
  calculateCompletionRate 
} from '../utils/habitUtils';

interface HabitContextType {
  habits: HabitWithStats[];
  selectedDate: Date;
  filterOption: FilterOption;
  sortOption: SortOption;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  archiveHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  setSelectedDate: (date: Date) => void;
  setSortOption: (option: SortOption) => void;
  setFilterOption: (option: FilterOption) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [filterOption, setFilterOption] = useState<FilterOption>('active');

  // Load habits and logs from localStorage on mount
  useEffect(() => {
    const loadedHabits = loadHabits();
    const loadedLogs = loadHabitLogs();
    setHabits(loadedHabits);
    setHabitLogs(loadedLogs);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveHabitLogs(habitLogs);
  }, [habitLogs]);

  const habitsWithStats: HabitWithStats[] = habits.map(habit => {
    const habitLogsFiltered = habitLogs.filter(log => log.habitId === habit.id);
    const currentStreak = calculateStreak(habit, habitLogsFiltered);
    const completionRate = calculateCompletionRate(habit, habitLogsFiltered);

    return {
      ...habit,
      currentStreak,
      longestStreak: currentStreak, // For simplicity, we're using the same value for now
      completionRate,
      logs: habitLogsFiltered
    };
  });

  // Sort habits based on the current sort option
  const sortedHabits = [...habitsWithStats].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'streak':
        return b.currentStreak - a.currentStreak;
      case 'completion':
        return b.completionRate - a.completionRate;
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Filter habits based on the current filter option
  const filteredHabits = sortedHabits.filter(habit => {
    if (filterOption === 'all') return true;
    if (filterOption === 'active') return !habit.archived;
    if (filterOption === 'archived') return habit.archived;
    return true;
  });

  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      archived: false
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const updateHabit = (habitId: string, updates: Partial<Habit>) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habitId ? { ...habit, ...updates } : habit
      )
    );
  };

  const archiveHabit = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habitId ? { ...habit, archived: !habit.archived } : habit
      )
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    setHabitLogs(prevLogs => prevLogs.filter(log => log.habitId !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const existingLog = habitLogs.find(
      log => log.habitId === habitId && log.date === date
    );

    if (existingLog) {
      setHabitLogs(prevLogs => 
        prevLogs.map(log => 
          log.id === existingLog.id 
            ? { ...log, completed: !log.completed } 
            : log
        )
      );
    } else {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habitId,
        date,
        completed: true
      };
      setHabitLogs(prevLogs => [...prevLogs, newLog]);
    }
  };

  return (
    <HabitContext.Provider 
      value={{
        habits: filteredHabits,
        selectedDate,
        filterOption,
        sortOption,
        addHabit,
        updateHabit,
        archiveHabit,
        deleteHabit,
        toggleHabitCompletion,
        setSelectedDate,
        setSortOption,
        setFilterOption
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};