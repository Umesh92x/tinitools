import ToolLayout from '@/components/layout/ToolLayout'
import { BusinessDaysCalculator } from '@/components/tools/datetime/BusinessDaysCalculator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Business Days Calculator',
  description: 'Free business days calculator - Calculate working days between two dates instantly, excluding weekends and holidays. No signup required.',
  path: '/datetime/business-days',
  keywords: ['business days calculator', 'working days', 'weekdays calculator', 'business days', 'work days calculator'],
})

export default function BusinessDaysPage() {
  const relatedTools = [
    { name: 'Date Calculator', href: '/datetime/calculator' },
    { name: 'Meeting Planner', href: '/datetime/meeting-planner' },
    { name: 'Calendar Generator', href: '/datetime/calendar' },
    { name: 'World Clock', href: '/datetime/world-clock' },
  ]

  return (
    <ToolLayout
      title="Business Days Calculator"
      description="Free business days calculator - Calculate working days between two dates instantly, excluding weekends and holidays. No signup required."
      category="datetime"
      categoryName="Date & Time"
      relatedTools={relatedTools}
    >
      <BusinessDaysCalculator />
    </ToolLayout>
  )
} 