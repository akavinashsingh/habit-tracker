import React from 'react';
import { Check, MoreVertical } from 'lucide-react';
import { HabitWithStats } from '../types/habit';
import { formatDateToYYYYMMDD } from '../utils/dateUtils';

interface HabitCardProps {
  habit: HabitWithStats;
  selectedDate: Date;
  onToggleCompletion: (habitId: string, date: string) => void;
  onEdit: (habit: HabitWithStats) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDate,
  onToggleCompletion,
  onEdit,
}) => {
  const dateStr = formatDateToYYYYMMDD(selectedDate);
  
  // Find if the habit is completed on the selected date
  const isCompleted = habit.logs.some(
    log => log.date === dateStr && log.completed
  );

  const handleToggle = () => {
    onToggleCompletion(habit.id, dateStr);
  };

  return (
    <div className={`card relative border-l-4 ${habit.color} mb-4`}>
      <div className="px-4 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {habit.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center">
            <button
              onClick={handleToggle}
              className={`h-8 w-8 rounded-full border-2 flex items-center justify-center mr-2 transition-all ${
                isCompleted
                  ? `${habit.color.replace('bg-', 'border-')} ${habit.color}`
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
            >
              {isCompleted && <Check className="h-5 w-5 text-white" />}
            </button>
            
            <button
              onClick={() => onEdit(habit)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex space-x-4">
            <div>
              <span className="font-medium">Current streak:</span> {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}
            </div>
            <div>
              <span className="font-medium">Completion rate:</span> {Math.round(habit.completionRate)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;