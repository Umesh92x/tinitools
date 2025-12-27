import { Metadata } from 'next'
import { TodoList } from '@/components/tools/productivity/TodoList'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Todo List',
  description: 'Free online todo list app - Manage your tasks with priorities, categories, subtasks, tags, and due dates instantly. Stay organized and productive. No signup required.',
  path: '/productivity/todo',
  keywords: ['todo list', 'task manager', 'online todo', 'task organizer', 'free todo app', 'task tracker'],
})

export default function TodoListPage() {
  const relatedTools = [
    { name: 'Note Taking', href: '/productivity/notes' },
    { name: 'Habit Tracker', href: '/productivity/habits' },
    { name: 'Goal Tracker', href: '/productivity/goal-tracker' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
  ]

  return (
    <ToolLayout
      title="Todo List"
      description="Free online todo list app - Manage your tasks with priorities, categories, subtasks, tags, and due dates instantly. Stay organized and productive. No signup required."
      category="productivity"
      categoryName="Productivity Tools"
      relatedTools={relatedTools}
    >
      <TodoList />
    </ToolLayout>
  )
} 