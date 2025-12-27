import { Metadata } from 'next'
import { ReadingTimeCalculator } from '@/components/tools/productivity/ReadingTimeCalculator'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Reading Time Calculator',
  description: 'Free reading time calculator - Calculate estimated reading time for any text instantly. Supports file upload and customizable reading speeds. No signup required.',
  path: '/productivity/reading-time',
  keywords: ['reading time calculator', 'reading speed', 'text length', 'word count', 'reading estimate'],
})

export default function ReadingTimeCalculatorPage() {
  const relatedTools = [
    { name: 'Typing Speed Test', href: '/productivity/typing-speed' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
    { name: 'Note Taking', href: '/productivity/notes' },
    { name: 'Todo List', href: '/productivity/todo' },
  ]

  return (
    <ToolLayout
      title="Reading Time Calculator"
      description="Free reading time calculator - Calculate estimated reading time for any text instantly. Supports file upload and customizable reading speeds. No signup required."
      category="productivity"
      categoryName="Productivity Tools"
      relatedTools={relatedTools}
    >
      <ReadingTimeCalculator />
    </ToolLayout>
  )
} 