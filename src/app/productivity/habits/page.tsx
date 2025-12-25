import { Metadata } from 'next'
import { HabitTracker } from '@/components/tools/productivity/HabitTracker'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Habit Tracker - Free Online Habit Tracking App',
  description: 'Free online habit tracking app with calendar view, statistics, goals, and streak tracking. Track and maintain your daily habits.',
  keywords: 'habit tracker, habit tracking, daily habits, habit formation, free habit tracker, streak tracker',
}

export default function HabitTrackerPage() {
  return (
    <ToolLayout
      title="Habit Tracker"
      description="Track and maintain your daily habits with calendar view, statistics, weekly goals, and streak tracking."
    >
      <HabitTracker />
    </ToolLayout>
  )
} 