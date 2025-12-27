import { Metadata } from 'next'
import { GpaCalculator } from '@/components/tools/educational/GpaCalculator'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'GPA Calculator',
  description: 'Free GPA calculator - Calculate your GPA (Grade Point Average) with multiple courses instantly. Supports letter grades and credit hours. No signup required.',
  path: '/educational/gpa-calculator',
  keywords: ['gpa calculator', 'grade point average', 'gpa calculator online', 'college gpa calculator'],
})

export default function GpaCalculatorPage() {
  const relatedTools = [
    { name: 'Grade Calculator', href: '/educational/grade-calculator' },
    { name: 'Scientific Calculator', href: '/educational/calculator' },
    { name: 'Math Formula Sheet', href: '/educational/math-formulas' },
    { name: 'Flashcard Generator', href: '/educational/flashcards' },
  ]

  return (
    <ToolLayout
      title="GPA Calculator"
      description="Free GPA calculator - Calculate your GPA (Grade Point Average) with multiple courses instantly. Supports letter grades and credit hours. No signup required."
      category="educational"
      categoryName="Educational Tools"
      relatedTools={relatedTools}
    >
      <GpaCalculator />
    </ToolLayout>
  )
}

