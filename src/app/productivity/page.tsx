import { Notebook, CheckSquare, LineChart, Timer, Keyboard, Clock, Target } from 'lucide-react'
import CategoryLayout from '@/components/layout/CategoryLayout'

export const metadata = {
  title: 'Productivity Tools - TiniTools',
  description: 'Free online productivity tools to help you stay organized and efficient. Includes note taking, todo list, habit tracker, time tracker, goal tracker, and more.',
}

const tools = [
  {
    name: 'Note Taking',
    description: 'Take and save notes with tags, categories, search, and export',
    href: '/productivity/notes',
    icon: Notebook,
  },
  {
    name: 'Todo List',
    description: 'Manage tasks with priorities, categories, subtasks, and filters',
    href: '/productivity/todo',
    icon: CheckSquare,
  },
  {
    name: 'Habit Tracker',
    description: 'Track habits with calendar view, statistics, and weekly goals',
    href: '/productivity/habits',
    icon: LineChart,
  },
  {
    name: 'Reading Time Calculator',
    description: 'Calculate reading time with file upload and customizable speeds',
    href: '/productivity/reading-time',
    icon: Timer,
  },
  {
    name: 'Writing Speed Test',
    description: 'Test typing speed with history, statistics, and accuracy tracking',
    href: '/productivity/typing-speed',
    icon: Keyboard,
  },
  {
    name: 'Time Tracker',
    description: 'Track time spent on tasks with categories and statistics',
    href: '/productivity/time-tracker',
    icon: Clock,
  },
  {
    name: 'Goal Tracker',
    description: 'Set and track goals with progress bars, deadlines, and categories',
    href: '/productivity/goal-tracker',
    icon: Target,
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