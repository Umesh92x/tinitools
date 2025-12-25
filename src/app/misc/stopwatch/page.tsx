import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { Stopwatch } from '@/components/tools/misc/Stopwatch'

export const metadata: Metadata = generateMetadata({
  title: 'Stopwatch',
  description: 'Precise stopwatch with lap timer functionality. Track time with millisecond accuracy.',
  path: '/misc/stopwatch',
  keywords: ['stopwatch', 'timer', 'lap timer', 'time tracker'],
})

export default function StopwatchPage() {
  return (
    <ToolLayout
      title="Stopwatch"
      description="Precise stopwatch with lap timer functionality. Track time with millisecond accuracy."
    >
      <Stopwatch />
    </ToolLayout>
  )
}

