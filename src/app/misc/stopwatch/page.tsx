import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { Stopwatch } from '@/components/tools/misc/Stopwatch'

export const metadata: Metadata = generateMetadata({
  title: 'Stopwatch',
  description: 'Free stopwatch - Precise stopwatch with lap timer functionality instantly. Track time with millisecond accuracy. No signup required.',
  path: '/misc/stopwatch',
  keywords: ['stopwatch', 'timer', 'lap timer', 'time tracker'],
})

export default function StopwatchPage() {
  const relatedTools = [
    { name: 'Countdown Timer', href: '/misc/countdown' },
    { name: 'Pomodoro Timer', href: '/misc/pomodoro' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
    { name: 'Date Calculator', href: '/datetime/calculator' },
  ]

  return (
    <ToolLayout
      title="Stopwatch"
      description="Free stopwatch - Precise stopwatch with lap timer functionality instantly. Track time with millisecond accuracy. No signup required."
      category="misc"
      categoryName="Misc Tools"
      relatedTools={relatedTools}
    >
      <Stopwatch />
    </ToolLayout>
  )
}

