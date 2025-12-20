import { Metadata } from 'next';
import HabitTracker from '@/components/tools/productivity/HabitTracker';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'Habit Tracker - Free Online Habit Tracking App',
  description: 'Free online habit tracking app with local storage. Track and maintain your daily habits.',
  keywords: 'habit tracker, habit tracking, daily habits, habit formation, free habit tracker',
};

export default function HabitTrackerPage() {
  return (
    <ToolLayout
      title="Habit Tracker"
      description="Track and maintain your daily habits."
    >
      <HabitTracker />
    </ToolLayout>
  );
} 