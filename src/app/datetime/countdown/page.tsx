import ToolLayout from '@/components/layout/ToolLayout'
import { CountdownTimer } from '@/components/tools/datetime/CountdownTimer'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Countdown Timer',
  description: 'Free countdown timer - Create customizable countdown timers for events, deadlines, or any special occasion instantly. No signup required.',
  path: '/datetime/countdown',
  keywords: ['countdown timer', 'event timer', 'deadline timer', 'time countdown', 'countdown generator'],
})

export default function CountdownTimerPage() {
  const relatedTools = [
    { name: 'Epoch Converter', href: '/datetime/epoch' },
    { name: 'Date Calculator', href: '/datetime/calculator' },
    { name: 'Calendar Generator', href: '/datetime/calendar' },
    { name: 'World Clock', href: '/datetime/world-clock' },
  ]

  return (
    <ToolLayout
      title="Countdown Timer"
      description="Free countdown timer - Create customizable countdown timers for events, deadlines, or any special occasion instantly. No signup required."
      category="datetime"
      categoryName="Date & Time"
      relatedTools={relatedTools}
    >
      <CountdownTimer />
    </ToolLayout>
  )
} 