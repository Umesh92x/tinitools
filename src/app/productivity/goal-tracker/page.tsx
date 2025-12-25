import { Metadata } from 'next'
import { GoalTracker } from '@/components/tools/productivity/GoalTracker'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Goal Tracker - Free Online Goal Tracking Tool',
  description: 'Free online goal tracker to set, track, and achieve your goals. Monitor progress with visual progress bars and deadlines.',
  keywords: 'goal tracker, goal tracking, goal setting, progress tracker, achievement tracker',
}

export default function GoalTrackerPage() {
  return (
    <ToolLayout
      title="Goal Tracker"
      description="Set, track, and achieve your goals. Monitor progress with visual progress bars, deadlines, and category organization."
    >
      <GoalTracker />
    </ToolLayout>
  )
}

