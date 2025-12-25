import { Metadata } from 'next'
import { ReadingTimeCalculator } from '@/components/tools/productivity/ReadingTimeCalculator'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Reading Time Calculator - Free Online Tool',
  description: 'Free online reading time calculator with file upload. Calculate estimated reading time for any text with customizable reading speeds.',
  keywords: 'reading time calculator, reading speed, text length, word count, reading estimate',
}

export default function ReadingTimeCalculatorPage() {
  return (
    <ToolLayout
      title="Reading Time Calculator"
      description="Calculate estimated reading time for any text. Supports file upload, customizable reading speeds, and detailed statistics."
    >
      <ReadingTimeCalculator />
    </ToolLayout>
  )
} 