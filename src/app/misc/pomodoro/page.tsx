import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PomodoroTimer } from '@/components/tools/misc/PomodoroTimer'

export const metadata: Metadata = generateMetadata({
  title: 'Pomodoro Timer',
  description: 'Stay focused with customizable Pomodoro timer. Set work and break intervals with notifications.',
  path: '/misc/pomodoro',
  keywords: ['pomodoro timer', 'focus timer', 'work timer', 'productivity timer'],
})

export default function PomodoroTimerPage() {
  return (
    <ToolLayout
      title="Pomodoro Timer"
      description="Stay focused with customizable Pomodoro timer. Set work and break intervals with notifications."
    >
      <PomodoroTimer />
    </ToolLayout>
  )
} 