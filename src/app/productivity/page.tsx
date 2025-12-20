import { Notebook, CheckSquare, LineChart, Timer, Keyboard } from 'lucide-react'
import CategoryLayout from '@/components/layout/CategoryLayout'

export const metadata = {
  title: 'Productivity Tools - TiniTools',
  description: 'Free online productivity tools to help you stay organized and efficient. Includes note taking, todo list, habit tracker, and more.',
}

const tools = [
  {
    name: 'Note Taking',
    description: 'Take and save notes with local storage persistence',
    href: '/productivity/notes',
    icon: Notebook,
  },
  {
    name: 'Todo List',
    description: 'Manage your tasks and stay organized',
    href: '/productivity/todo',
    icon: CheckSquare,
  },
  {
    name: 'Habit Tracker',
    description: 'Track and maintain your daily habits',
    href: '/productivity/habits',
    icon: LineChart,
  },
  {
    name: 'Reading Time Calculator',
    description: 'Calculate estimated reading time for any text',
    href: '/productivity/reading-time',
    icon: Timer,
  },
  {
    name: 'Writing Speed Test',
    description: 'Test and improve your typing speed',
    href: '/productivity/typing-speed',
    icon: Keyboard,
  },
]

export default function ProductivityToolsPage() {
  return (
    <CategoryLayout
      title="Productivity Tools"
      description="A collection of tools to help you stay organized and boost your productivity."
      tools={tools}
    />
  )
} 