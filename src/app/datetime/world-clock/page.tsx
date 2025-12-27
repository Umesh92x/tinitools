import ToolLayout from '@/components/layout/ToolLayout'
import { WorldClock } from '@/components/tools/datetime/WorldClock'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'World Clock',
  description: 'Free world clock - View current time across multiple time zones instantly. Easy to use world clock with popular cities and time zones. No signup required.',
  path: '/datetime/world-clock',
  keywords: ['world clock', 'time zones', 'time converter', 'world time', 'time zone converter'],
})

export default function WorldClockPage() {
  const relatedTools = [
    { name: 'Meeting Planner', href: '/datetime/meeting-planner' },
    { name: 'Date Calculator', href: '/datetime/calculator' },
    { name: 'Epoch Converter', href: '/datetime/epoch' },
    { name: 'Business Days Calculator', href: '/datetime/business-days' },
  ]

  return (
    <ToolLayout
      title="World Clock"
      description="Free world clock - View current time across multiple time zones instantly. Easy to use world clock with popular cities and time zones. No signup required."
      category="datetime"
      categoryName="Date & Time"
      relatedTools={relatedTools}
    >
      <WorldClock />
    </ToolLayout>
  )
} 