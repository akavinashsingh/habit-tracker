import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthName, getDatesInMonth, isToday, isSameDay } from '../utils/dateUtils';
import { HabitWithStats } from '../types/habit';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  habits: HabitWithStats[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, habits }) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = React.useState(selectedDate.getFullYear());

  // Get dates for the current month
  const dates = getDatesInMonth(currentYear, currentMonth);
  
  // Calculate the starting day of the week (0 = Sunday, 1 = Monday, ...)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create blank spaces for days before the first day of the month
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  // Combine blanks and dates to create the calendar grid
  const days = [...blanks.map(() => null), ...dates];
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Check if a day has completed habits
  const getDayCompletionStatus = (date: Date) => {
    if (!date) return { completed: 0, total: 0 };
    
    const dateStr = date.toISOString().split('T')[0];
    
    let totalHabits = 0;
    let completedHabits = 0;
    
    habits.forEach(habit => {
      // Check if the habit was created on or before this date
      const habitCreatedDate = new Date(habit.createdAt);
      if (habitCreatedDate <= date) {
        totalHabits++;
        
        // Check if there's a completed log for this date
        const log = habit.logs.find(l => l.date === dateStr);
        if (log && log.completed) {
          completedHabits++;
        }
      }
    });
    
    return { completed: completedHabits, total: totalHabits };
  };
  
  return (
    <div className="card p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Calendar
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevMonth}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {getMonthName(currentMonth)} {currentYear}
          </span>
          
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`blank-${index}`} className="h-10 sm:h-12" />;
          }
          
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const { completed, total } = getDayCompletionStatus(date);
          const completionRate = total > 0 ? completed / total : 0;
          
          // Determine background color based on completion rate
          let bgColorClass = '';
          if (total > 0) {
            if (completionRate === 1) {
              bgColorClass = 'bg-teal-100 dark:bg-teal-900';
            } else if (completionRate > 0) {
              bgColorClass = 'bg-teal-50 dark:bg-teal-900/40';
            }
          }
          
          return (
            <button
              key={date.getTime()}
              onClick={() => onDateSelect(date)}
              disabled={date > new Date()} // Disable future dates
              className={`
                h-10 sm:h-12 rounded-md flex flex-col items-center justify-center relative
                ${isSelected ? 'ring-2 ring-teal-500' : ''}
                ${isTodayDate ? 'font-bold' : ''}
                ${date > new Date() ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${bgColorClass}
              `}
            >
              <span className={`text-sm ${isSelected ? 'text-teal-600 dark:text-teal-400' : ''}`}>
                {date.getDate()}
              </span>
              
              {total > 0 && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {completed}/{total}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;