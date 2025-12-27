import { Metadata } from 'next'
import { GradeCalculator } from '@/components/tools/educational/GradeCalculator'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Grade Calculator',
  description: 'Free grade calculator - Calculate your final grade with weighted assignments and exams instantly. Supports multiple grade items with custom weights. No signup required.',
  path: '/educational/grade-calculator',
  keywords: ['grade calculator', 'gpa calculator', 'weighted grades', 'final grade calculator', 'course grade calculator'],
})

export default function GradeCalculatorPage() {
  const relatedTools = [
    { name: 'GPA Calculator', href: '/educational/gpa-calculator' },
    { name: 'Scientific Calculator', href: '/educational/calculator' },
    { name: 'Math Formula Sheet', href: '/educational/math-formulas' },
    { name: 'Flashcard Generator', href: '/educational/flashcards' },
  ]

  return (
    <ToolLayout
      title="Grade Calculator"
      description="Free grade calculator - Calculate your final grade with weighted assignments and exams instantly. Supports multiple grade items with custom weights. No signup required."
      category="educational"
      categoryName="Educational Tools"
      relatedTools={relatedTools}
    >
      <GradeCalculator />
    </ToolLayout>
  )
}

