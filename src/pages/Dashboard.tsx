import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import { Habit, HabitWithStats } from '../types/habit';
import { formatDateToYYYYMMDD } from '../utils/dateUtils';

import DateSelector from '../components/DateSelector';
import StatsCard from '../components/StatsCard';
import Calendar from '../components/Calendar';
import HabitList from '../components/HabitList';
import HabitModal from '../components/HabitModal';

const Dashboard: React.FC = () => {
  const {
    habits,
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
  } = useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithStats | null>(null);

  const handleAddHabit = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEditHabit = (habit: HabitWithStats) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleSubmitHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <DateSelector 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      
      <StatsCard habits={habits} />
      
      <Calendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        habits={habits}
      />
      
      <div className="mb-6 flex justify-between items-center">
        <HabitList
          habits={habits}
          selectedDate={selectedDate}
          onToggleCompletion={toggleHabitCompletion}
          onEditHabit={handleEditHabit}
          sortOption={sortOption}
          filterOption={filterOption}
          onSortChange={setSortOption}
          onFilterChange={setFilterOption}
        />
      </div>
      
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleAddHabit}
          className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          aria-label="Add new habit"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
      
      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitHabit}
        editingHabit={editingHabit}
        onArchive={archiveHabit}
        onDelete={deleteHabit}
      />
    </div>
  );
};

export default Dashboard;