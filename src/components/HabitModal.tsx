import React from 'react';
import { Habit, HabitWithStats } from '../types/habit';
import HabitForm from './HabitForm';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  editingHabit: HabitWithStats | null;
  onArchive?: (habitId: string) => void;
  onDelete?: (habitId: string) => void;
}

const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingHabit,
  onArchive,
  onDelete,
}) => {
  if (!isOpen) return null;

  const handleArchive = () => {
    if (editingHabit && onArchive) {
      onArchive(editingHabit.id);
      onClose();
    }
  };

  const handleDelete = () => {
    if (editingHabit && onDelete && window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      onDelete(editingHabit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-auto shadow-xl z-10">
          <div className="p-1">
            <HabitForm
              onSubmit={onSubmit}
              onCancel={onClose}
              initialData={editingHabit || undefined}
            />
            
            {editingHabit && (
              <div className="px-5 pb-5 pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleArchive}
                    className="btn btn-outline text-gray-700 dark:text-gray-300"
                    type="button"
                  >
                    {editingHabit.archived ? 'Unarchive habit' : 'Archive habit'}
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="btn text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    type="button"
                  >
                    Delete habit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitModal;