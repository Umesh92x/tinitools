'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  streak: number;
  lastChecked: string | null;
  createdAt: string;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      streak: 0,
      lastChecked: null,
      createdAt: new Date().toISOString(),
    };

    setHabits([habit, ...habits]);
    setNewHabit('');
    toast.success('Habit added successfully');
  };

  const handleCheckHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map((habit) => {
      if (habit.id === id) {
        const lastCheckedDate = habit.lastChecked?.split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // If never checked or checked today, do nothing
        if (!habit.lastChecked || lastCheckedDate === today) {
          return habit;
        }

        // If checked yesterday, increment streak
        if (lastCheckedDate === yesterdayStr) {
          return {
            ...habit,
            streak: habit.streak + 1,
            lastChecked: today,
          };
        }

        // If streak broken, reset streak
        return {
          ...habit,
          streak: 1,
          lastChecked: today,
        };
      }
      return habit;
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    toast.success('Habit deleted successfully');
  };

  const isCheckedToday = (lastChecked: string | null) => {
    if (!lastChecked) return false;
    const today = new Date().toISOString().split('T')[0];
    return lastChecked.split('T')[0] === today;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleAddHabit} className="flex gap-2">
          <Input
            placeholder="Add a new habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
          />
          <Button type="submit">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>
      </Card>

      <div className="space-y-2">
        {habits.map((habit) => (
          <Card key={habit.id} className="p-4">
            <div className="flex items-center gap-4">
              <Button
                variant={isCheckedToday(habit.lastChecked) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCheckHabit(habit.id)}
              >
                {isCheckedToday(habit.lastChecked) ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <XIcon className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1">
                <div className="font-medium">{habit.name}</div>
                <div className="text-sm text-muted-foreground">
                  {habit.streak} day streak
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteHabit(habit.id)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {habits.length === 0 && (
        <div className="text-center text-muted-foreground">
          No habits added yet. Start by adding a new habit above.
        </div>
      )}
    </div>
  );
} 