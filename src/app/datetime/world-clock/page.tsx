import ToolLayout from '@/components/layout/ToolLayout'
import { WorldClock } from '@/components/tools/datetime/WorldClock'

export const metadata = {
  title: 'World Clock - Time Zones Converter',
  description: 'View current time across multiple time zones. Easy to use world clock with popular cities and time zones.',
}

export default function WorldClockPage() {
  return (
    <ToolLayout
      title="World Clock"
      description="View current time across multiple time zones. Search and compare different cities and regions."
    >
      <WorldClock />
    </ToolLayout>
  )
} 