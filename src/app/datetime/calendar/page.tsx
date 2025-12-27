import ToolLayout from '@/components/layout/ToolLayout'
import { CalendarGenerator } from '@/components/tools/datetime/CalendarGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Calendar Generator',
  description: 'Free calendar generator - Generate printable monthly or yearly calendars with customizable options instantly. No signup required.',
  path: '/datetime/calendar',
  keywords: ['calendar generator', 'printable calendar', 'monthly calendar', 'yearly calendar', 'calendar maker'],
})

export default function CalendarGeneratorPage() {
  const relatedTools = [
    { name: 'Business Days Calculator', href: '/datetime/business-days' },
    { name: 'Date Calculator', href: '/datetime/calculator' },
    { name: 'Meeting Planner', href: '/datetime/meeting-planner' },
    { name: 'Countdown Timer', href: '/datetime/countdown' },
  ]

  return (
    <ToolLayout
      title="Calendar Generator"
      description="Free calendar generator - Generate printable monthly or yearly calendars with customizable options instantly. No signup required."
      category="datetime"
      categoryName="Date & Time"
      relatedTools={relatedTools}
    >
      <CalendarGenerator />
    </ToolLayout>
  )
} 