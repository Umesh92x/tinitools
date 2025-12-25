import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { CountdownTimer } from '@/components/tools/misc/CountdownTimer'

export const metadata: Metadata = generateMetadata({
  title: 'Countdown Timer',
  description: 'Set a countdown timer with custom hours, minutes, and seconds. Get notified when time is up.',
  path: '/misc/countdown',
  keywords: ['countdown timer', 'timer', 'alarm', 'countdown'],
})

export default function CountdownTimerPage() {
  return (
    <ToolLayout
      title="Countdown Timer"
      description="Set a countdown timer with custom hours, minutes, and seconds. Get notified when time is up."
    >
      <CountdownTimer />
    </ToolLayout>
  )
}

