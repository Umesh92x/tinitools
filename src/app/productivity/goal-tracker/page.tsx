import { Metadata } from 'next'
import { GoalTracker } from '@/components/tools/productivity/GoalTracker'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Goal Tracker',
  description: 'Free online goal tracker - Set, track, and achieve your goals instantly. Monitor progress with visual progress bars and deadlines. No signup required.',
  path: '/productivity/goal-tracker',
  keywords: ['goal tracker', 'goal tracking', 'goal setting', 'progress tracker', 'achievement tracker'],
})

export default function GoalTrackerPage() {
  const relatedTools = [
    { name: 'Habit Tracker', href: '/productivity/habits' },
    { name: 'Todo List', href: '/productivity/todo' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
    { name: 'Note Taking', href: '/productivity/notes' },
  ]

  return (
    <ToolLayout
      title="Goal Tracker"
      description="Free online goal tracker - Set, track, and achieve your goals instantly. Monitor progress with visual progress bars and deadlines. No signup required."
      category="productivity"
      categoryName="Productivity Tools"
      relatedTools={relatedTools}
    >
      <GoalTracker />
    </ToolLayout>
  )
}

