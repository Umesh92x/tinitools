import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PomodoroTimer } from '@/components/tools/misc/PomodoroTimer'

export const metadata: Metadata = generateMetadata({
  title: 'Pomodoro Timer',
  description: 'Free Pomodoro timer - Stay focused with customizable Pomodoro timer instantly. Set work and break intervals with notifications. No signup required.',
  path: '/misc/pomodoro',
  keywords: ['pomodoro timer', 'focus timer', 'work timer', 'productivity timer'],
})

export default function PomodoroTimerPage() {
  const relatedTools = [
    { name: 'Countdown Timer', href: '/misc/countdown' },
    { name: 'Stopwatch', href: '/misc/stopwatch' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
    { name: 'Todo List', href: '/productivity/todo' },
  ]

  return (
    <ToolLayout
      title="Pomodoro Timer"
      description="Free Pomodoro timer - Stay focused with customizable Pomodoro timer instantly. Set work and break intervals with notifications. No signup required."
      category="misc"
      categoryName="Misc Tools"
      relatedTools={relatedTools}
    >
      <PomodoroTimer />
    </ToolLayout>
  )
} 