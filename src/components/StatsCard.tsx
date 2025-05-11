import React from 'react';
import { HabitWithStats } from '../types/habit';

interface StatsCardProps {
  habits: HabitWithStats[];
}

const StatsCard: React.FC<StatsCardProps> = ({ habits }) => {
  // Calculate overall statistics
  const totalHabits = habits.length;
  const activeHabits = habits.filter(habit => !habit.archived).length;
  
  // Calculate total streaks
  const totalStreak = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  
  // Calculate average completion rate
  const avgCompletionRate = habits.length > 0
    ? habits.reduce((sum, habit) => sum + habit.completionRate, 0) / habits.length
    : 0;
  
  // Find the habit with the longest streak
  const habitWithLongestStreak = habits.reduce(
    (max, habit) => (habit.currentStreak > max.currentStreak ? habit : max),
    { name: 'None', currentStreak: 0 } as HabitWithStats
  );

  const stats = [
    { label: 'Active Habits', value: activeHabits },
    { label: 'Total Streak Days', value: totalStreak },
    { label: 'Avg. Completion', value: `${Math.round(avgCompletionRate)}%` },
    { 
      label: 'Longest Streak', 
      value: habitWithLongestStreak.currentStreak > 0 
        ? `${habitWithLongestStreak.currentStreak} (${habitWithLongestStreak.name})` 
        : 'None' 
    },
  ];

  return (
    <div className="card p-5 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Your Progress
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;