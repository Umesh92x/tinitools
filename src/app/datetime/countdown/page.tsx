import ToolLayout from '@/components/layout/ToolLayout'
import { CountdownTimer } from '@/components/tools/datetime/CountdownTimer'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Countdown Timer',
  description: 'Create customizable countdown timers for events, deadlines, or any special occasion.',
  keywords: ['countdown timer', 'event timer', 'deadline timer', 'time countdown', 'countdown generator'],
})

export default function CountdownTimerPage() {
  return (
    <ToolLayout
      title="Countdown Timer"
      description="Create customizable countdown timers for events, deadlines, or any special occasion."
    >
      <CountdownTimer />
    </ToolLayout>
  )
} 