import ToolLayout from '@/components/layout/ToolLayout'
import { MeetingPlanner } from '@/components/tools/datetime/MeetingPlanner'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Meeting Time Zone Planner',
  description: 'Free meeting planner - Plan meetings across different time zones instantly. Find the best time for all participants with our easy-to-use meeting planner. No signup required.',
  path: '/datetime/meeting-planner',
  keywords: ['meeting planner', 'time zone planner', 'meeting scheduler', 'time zone converter', 'meeting time finder'],
})

export default function MeetingPlannerPage() {
  const relatedTools = [
    { name: 'World Clock', href: '/datetime/world-clock' },
    { name: 'Date Calculator', href: '/datetime/calculator' },
    { name: 'Business Days Calculator', href: '/datetime/business-days' },
    { name: 'Calendar Generator', href: '/datetime/calendar' },
  ]

  return (
    <ToolLayout
      title="Meeting Time Zone Planner"
      description="Free meeting planner - Plan meetings across different time zones instantly. Find the best time for all participants with our easy-to-use meeting planner. No signup required."
      category="datetime"
      categoryName="Date & Time"
      relatedTools={relatedTools}
    >
      <MeetingPlanner />
    </ToolLayout>
  )
} 