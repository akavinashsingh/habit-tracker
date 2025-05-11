import React from 'react';
import { HabitWithStats, SortOption, FilterOption } from '../types/habit';
import HabitCard from './HabitCard';
import { Filter, ArrowDownAZ, Activity, Clock } from 'lucide-react';

interface HabitListProps {
  habits: HabitWithStats[];
  selectedDate: Date;
  onToggleCompletion: (habitId: string, date: string) => void;
  onEditHabit: (habit: HabitWithStats) => void;
  sortOption: SortOption;
  filterOption: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  selectedDate,
  onToggleCompletion,
  onEditHabit,
  sortOption,
  filterOption,
  onSortChange,
  onFilterChange,
}) => {
  // Filter options dropdown
  const filterOptions = [
    { value: 'all', label: 'All Habits' },
    { value: 'active', label: 'Active Habits' },
    { value: 'archived', label: 'Archived Habits' },
  ];

  // Sort options dropdown
  const sortOptions = [
    { value: 'name', label: 'Name', icon: <ArrowDownAZ className="h-4 w-4" /> },
    { value: 'streak', label: 'Streak', icon: <Activity className="h-4 w-4" /> },
    { value: 'completion', label: 'Completion Rate', icon: <Activity className="h-4 w-4" /> },
    { value: 'created', label: 'Recently Added', icon: <Clock className="h-4 w-4" /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Your Habits
        </h2>
        
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={filterOption}
              onChange={(e) => onFilterChange(e.target.value as FilterOption)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                        text-gray-700 dark:text-white py-2 px-3 pr-8 rounded-md text-sm font-medium
                        focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                        text-gray-700 dark:text-white py-2 px-3 pr-8 rounded-md text-sm font-medium
                        focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-2.5 text-gray-500 dark:text-gray-400 pointer-events-none">
              {sortOptions.find(option => option.value === sortOption)?.icon}
            </div>
          </div>
        </div>
      </div>
      
      {habits.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {filterOption === 'archived'
              ? "You don't have any archived habits yet."
              : "You don't have any habits yet. Add one to get started!"}
          </p>
        </div>
      ) : (
        <div>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              selectedDate={selectedDate}
              onToggleCompletion={onToggleCompletion}
              onEdit={onEditHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitList;