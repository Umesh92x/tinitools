import ToolLayout from '@/components/layout/ToolLayout'
import { MeetingPlanner } from '@/components/tools/datetime/MeetingPlanner'

export const metadata = {
  title: 'Meeting Time Zone Planner',
  description: 'Plan meetings across different time zones. Find the best time for all participants with our easy-to-use meeting planner.',
}

export default function MeetingPlannerPage() {
  return (
    <ToolLayout
      title="Meeting Time Zone Planner"
      description="Plan meetings across different time zones. Add participants from different regions and find suitable meeting times."
    >
      <MeetingPlanner />
    </ToolLayout>
  )
} 