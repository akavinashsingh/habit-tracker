import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { isToday } from '../utils/dateUtils';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const handlePrevDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    onDateChange(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    // Don't allow selecting future dates beyond today
    if (nextDate <= new Date()) {
      onDateChange(nextDate);
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <button
          onClick={handlePrevDay}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Previous day"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <span className="mx-2 font-semibold text-gray-800 dark:text-white">
          {formatDate(selectedDate)}
          {isToday(selectedDate) && (
            <span className="ml-2 text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">Today</span>
          )}
        </span>
        
        <button
          onClick={handleNextDay}
          className={`p-1 rounded-full ${
            isToday(selectedDate)
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
          disabled={isToday(selectedDate)}
          aria-label="Next day"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {!isToday(selectedDate) && (
        <button
          onClick={handleToday}
          className="flex items-center text-sm btn btn-outline"
          aria-label="Go to today"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Today
        </button>
      )}
    </div>
  );
};

export default DateSelector;