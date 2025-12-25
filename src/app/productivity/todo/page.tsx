import { Metadata } from 'next'
import { TodoList } from '@/components/tools/productivity/TodoList'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Todo List - Free Online Task Manager',
  description: 'Free online todo list app with priorities, categories, subtasks, tags, and due dates. Manage your tasks and stay organized.',
  keywords: 'todo list, task manager, online todo, task organizer, free todo app, task tracker',
}

export default function TodoListPage() {
  return (
    <ToolLayout
      title="Todo List"
      description="Manage your tasks with priorities, categories, subtasks, tags, and due dates. Stay organized and productive."
    >
      <TodoList />
    </ToolLayout>
  )
} 