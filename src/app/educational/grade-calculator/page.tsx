import { Metadata } from 'next'
import { GradeCalculator } from '@/components/tools/educational/GradeCalculator'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Grade Calculator - Free Online Grade Calculator',
  description: 'Calculate your final grade with weighted assignments and exams. Supports multiple grade items with custom weights.',
  keywords: 'grade calculator, gpa calculator, weighted grades, final grade calculator, course grade calculator',
}

export default function GradeCalculatorPage() {
  return (
    <ToolLayout
      title="Grade Calculator"
      description="Calculate your final grade with weighted assignments and exams. Supports multiple grade items with custom weights and shows letter grades and GPA."
    >
      <GradeCalculator />
    </ToolLayout>
  )
}

