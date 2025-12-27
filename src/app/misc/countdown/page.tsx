import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { CountdownTimer } from '@/components/tools/misc/CountdownTimer'

export const metadata: Metadata = generateMetadata({
  title: 'Countdown Timer',
  description: 'Free countdown timer - Set a countdown timer with custom hours, minutes, and seconds instantly. Get notified when time is up. No signup required.',
  path: '/misc/countdown',
  keywords: ['countdown timer', 'timer', 'alarm', 'countdown'],
})

export default function CountdownTimerPage() {
  const relatedTools = [
    { name: 'Stopwatch', href: '/misc/stopwatch' },
    { name: 'Pomodoro Timer', href: '/misc/pomodoro' },
    { name: 'Date Countdown', href: '/datetime/countdown' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
  ]

  return (
    <ToolLayout
      title="Countdown Timer"
      description="Free countdown timer - Set a countdown timer with custom hours, minutes, and seconds instantly. Get notified when time is up. No signup required."
      category="misc"
      categoryName="Misc Tools"
      relatedTools={relatedTools}
    >
      <CountdownTimer />
    </ToolLayout>
  )
}

