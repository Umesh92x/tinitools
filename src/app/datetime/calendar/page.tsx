import ToolLayout from '@/components/layout/ToolLayout'
import { CalendarGenerator } from '@/components/tools/datetime/CalendarGenerator'

export const metadata = {
  title: 'Calendar Generator',
  description: 'Generate printable monthly or yearly calendars with customizable options.',
}

export default function CalendarGeneratorPage() {
  return (
    <ToolLayout
      title="Calendar Generator"
      description="Create and print customizable calendars. Choose between monthly and yearly views, week numbers, and more."
    >
      <CalendarGenerator />
    </ToolLayout>
  )
} 