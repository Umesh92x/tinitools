import { Metadata } from 'next'
import { MultiplicationTable } from '@/components/tools/educational/MultiplicationTable'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Multiplication Table Generator',
  description: 'Free multiplication table generator - Generate customizable multiplication tables with practice mode and quiz instantly. Perfect for learning and teaching basic mathematics. No signup required.',
  path: '/educational/multiplication-table',
  keywords: ['multiplication table', 'times table', 'math practice', 'multiplication quiz', 'math learning'],
})

export default function MultiplicationTablePage() {
  const relatedTools = [
    { name: 'Math Formula Sheet', href: '/educational/math-formulas' },
    { name: 'Scientific Calculator', href: '/educational/calculator' },
    { name: 'Grade Calculator', href: '/educational/grade-calculator' },
    { name: 'GPA Calculator', href: '/educational/gpa-calculator' },
  ]

  return (
    <ToolLayout
      title="Multiplication Table Generator"
      description="Free multiplication table generator - Generate customizable multiplication tables with practice mode and quiz instantly. Perfect for learning and teaching basic mathematics. No signup required."
      category="educational"
      categoryName="Educational Tools"
      relatedTools={relatedTools}
    >
      <MultiplicationTable />
    </ToolLayout>
  )
} 