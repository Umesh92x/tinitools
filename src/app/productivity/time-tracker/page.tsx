import { Metadata } from 'next'
import { TimeTracker } from '@/components/tools/productivity/TimeTracker'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Time Tracker - Free Online Time Tracking Tool',
  description: 'Free online time tracker to track time spent on tasks and projects. Monitor your productivity with category-based time tracking.',
  keywords: 'time tracker, time tracking, task timer, productivity tracker, time management',
}

export default function TimeTrackerPage() {
  return (
    <ToolLayout
      title="Time Tracker"
      description="Track time spent on tasks and projects. Monitor your productivity with category-based time tracking and statistics."
    >
      <TimeTracker />
    </ToolLayout>
  )
}

