import { Metadata } from 'next'
import { HabitTracker } from '@/components/tools/productivity/HabitTracker'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Habit Tracker',
  description: 'Free online habit tracker - Track and maintain your daily habits instantly with calendar view, statistics, goals, and streak tracking. No signup required.',
  path: '/productivity/habits',
  keywords: ['habit tracker', 'habit tracking', 'daily habits', 'habit formation', 'free habit tracker', 'streak tracker'],
})

export default function HabitTrackerPage() {
  const relatedTools = [
    { name: 'Goal Tracker', href: '/productivity/goal-tracker' },
    { name: 'Todo List', href: '/productivity/todo' },
    { name: 'Note Taking', href: '/productivity/notes' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
  ]

  return (
    <ToolLayout
      title="Habit Tracker"
      description="Free online habit tracker - Track and maintain your daily habits instantly with calendar view, statistics, goals, and streak tracking. No signup required."
      category="productivity"
      categoryName="Productivity Tools"
      relatedTools={relatedTools}
    >
      <HabitTracker />
    </ToolLayout>
  )
} 