import { Metadata } from 'next'
import { TimeTracker } from '@/components/tools/productivity/TimeTracker'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Time Tracker',
  description: 'Free online time tracker - Track time spent on tasks and projects instantly. Monitor your productivity with category-based time tracking. No signup required.',
  path: '/productivity/time-tracker',
  keywords: ['time tracker', 'time tracking', 'task timer', 'productivity tracker', 'time management'],
})

export default function TimeTrackerPage() {
  const relatedTools = [
    { name: 'Todo List', href: '/productivity/todo' },
    { name: 'Goal Tracker', href: '/productivity/goal-tracker' },
    { name: 'Habit Tracker', href: '/productivity/habits' },
    { name: 'Note Taking', href: '/productivity/notes' },
  ]

  return (
    <ToolLayout
      title="Time Tracker"
      description="Free online time tracker - Track time spent on tasks and projects instantly. Monitor your productivity with category-based time tracking. No signup required."
      category="productivity"
      categoryName="Productivity Tools"
      relatedTools={relatedTools}
    >
      <TimeTracker />
    </ToolLayout>
  )
}

