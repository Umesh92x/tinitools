'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'today' | 'recent'>('all');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error('Please enter a task');
      return;
    }

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newDueDate || new Date().toISOString(),
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
    setNewDueDate('');
    toast.success('Task added successfully');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success('Task deleted successfully');
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    toast.success('Completed tasks cleared');
  };

  const isToday = (date: string) => {
    const today = new Date();
    const taskDate = new Date(date);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  const isWithinLastFiveDays = (date: string) => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const taskDate = new Date(date);
    return taskDate >= fiveDaysAgo && !isToday(date);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'today') return isToday(todo.dueDate || todo.createdAt);
    if (filter === 'recent') return isWithinLastFiveDays(todo.dueDate || todo.createdAt);
    return true;
  });

  const groupedTodos = filteredTodos.reduce((groups, todo) => {
    const date = todo.dueDate || todo.createdAt;
    const dateStr = new Date(date).toLocaleDateString();
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(todo);
    return groups;
  }, {} as Record<string, Todo[]>);

  const sortedDates = Object.keys(groupedTodos).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1"
          />
          <Input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-40"
          />
          <Button type="submit">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'today' ? 'default' : 'outline'}
            onClick={() => setFilter('today')}
          >
            Today
          </Button>
          <Button
            variant={filter === 'recent' ? 'default' : 'outline'}
            onClick={() => setFilter('recent')}
          >
            Last 5 Days
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
          <Button
            variant="outline"
            className="ml-auto"
            onClick={handleClearCompleted}
          >
            Clear Completed
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        {sortedDates.map((dateStr) => (
          <div key={dateStr}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {isToday(dateStr) ? 'Today' : new Date(dateStr).toLocaleDateString()}
            </h3>
            <div className="space-y-2">
              {groupedTodos[dateStr].map((todo) => (
                <Card key={todo.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id)}
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} remaining
      </div>
    </div>
  );
} 