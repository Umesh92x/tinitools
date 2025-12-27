import { Metadata } from 'next'
import { WritingSpeedTest } from '@/components/tools/productivity/WritingSpeedTest'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Writing Speed Test',
  description: 'Free typing speed test - Test and improve your typing speed instantly with real-time accuracy tracking, test history, and detailed statistics. No signup required.',
  path: '/productivity/typing-speed',
  keywords: ['writing speed test', 'typing test', 'typing speed', 'wpm calculator', 'typing practice', 'typing statistics'],
})

export default function WritingSpeedTestPage() {
  const relatedTools = [
    { name: 'Reading Time Calculator', href: '/productivity/reading-time' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
    { name: 'Note Taking', href: '/productivity/notes' },
    { name: 'Todo List', href: '/productivity/todo' },
  ]

  return (
    <ToolLayout
      title="Writing Speed Test"
      description="Free typing speed test - Test and improve your typing speed instantly with real-time accuracy tracking, test history, and detailed statistics. No signup required."
      category="productivity"
      categoryName="Productivity Tools"
      relatedTools={relatedTools}
    >
      <WritingSpeedTest />
    </ToolLayout>
  )
} 