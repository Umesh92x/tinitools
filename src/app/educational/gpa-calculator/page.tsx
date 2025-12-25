import { Metadata } from 'next'
import { GpaCalculator } from '@/components/tools/educational/GpaCalculator'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'GPA Calculator - Free Online GPA Calculator',
  description: 'Calculate your GPA (Grade Point Average) with multiple courses. Supports letter grades and credit hours.',
  keywords: 'gpa calculator, grade point average, gpa calculator online, college gpa calculator',
}

export default function GpaCalculatorPage() {
  return (
    <ToolLayout
      title="GPA Calculator"
      description="Calculate your GPA (Grade Point Average) with multiple courses. Supports letter grades (A+, A, A-, B+, etc.) and credit hours."
    >
      <GpaCalculator />
    </ToolLayout>
  )
}

