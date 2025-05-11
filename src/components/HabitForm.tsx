import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Habit } from '../types/habit';
import { habitColors } from '../utils/habitUtils';
import { getWeekdayNames } from '../utils/dateUtils';

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  onCancel: () => void;
  initialData?: Habit;
}

const HabitForm: React.FC<HabitFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [color, setColor] = useState(habitColors[0]);
  
  const weekdays = getWeekdayNames();

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setFrequency(initialData.frequency);
      setCustomDays(initialData.customDays || []);
      setColor(initialData.color);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name,
      description,
      frequency,
      customDays: frequency === 'custom' ? customDays : undefined,
      color,
    });
    
    // Reset form
    setName('');
    setDescription('');
    setFrequency('daily');
    setCustomDays([]);
    setColor(habitColors[0]);
  };

  const toggleCustomDay = (day: number) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter(d => d !== day));
    } else {
      setCustomDays([...customDays, day]);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {initialData ? 'Edit Habit' : 'Add New Habit'}
        </h2>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Habit Name*
          </label>
          <input
            type="text"
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Drink water"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            className="input min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., Drink 8 glasses of water daily"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frequency
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn ${
                frequency === 'daily' ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => setFrequency('daily')}
            >
              Daily
            </button>
            <button
              type="button"
              className={`btn ${
                frequency === 'weekly' ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => setFrequency('weekly')}
            >
              Weekly
            </button>
            <button
              type="button"
              className={`btn ${
                frequency === 'custom' ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => setFrequency('custom')}
            >
              Custom
            </button>
          </div>
        </div>
        
        {frequency === 'custom' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Days
            </label>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`btn ${
                    customDays.includes(day) ? 'btn-primary' : 'btn-outline'
                  }`}
                  onClick={() => toggleCustomDay(day)}
                >
                  {weekdays[day]}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {habitColors.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                className={`h-8 w-8 rounded-full ${colorOption} ${
                  color === colorOption ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                onClick={() => setColor(colorOption)}
                aria-label={`Select ${colorOption} color`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!name.trim() || (frequency === 'custom' && customDays.length === 0)}
          >
            {initialData ? 'Update Habit' : 'Add Habit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;