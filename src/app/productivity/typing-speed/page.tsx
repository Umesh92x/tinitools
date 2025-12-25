import { Metadata } from 'next'
import { WritingSpeedTest } from '@/components/tools/productivity/WritingSpeedTest'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Writing Speed Test - Free Online Typing Test',
  description: 'Free online writing speed test with history and statistics. Test and improve your typing speed with accuracy tracking.',
  keywords: 'writing speed test, typing test, typing speed, wpm calculator, typing practice, typing statistics',
}

export default function WritingSpeedTestPage() {
  return (
    <ToolLayout
      title="Writing Speed Test"
      description="Test and improve your typing speed with real-time accuracy tracking, test history, and detailed statistics."
    >
      <WritingSpeedTest />
    </ToolLayout>
  )
} 