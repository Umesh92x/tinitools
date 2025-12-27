import ToolLayout from '@/components/layout/ToolLayout'
import { PercentageCalculator } from '@/components/tools/math/PercentageCalculator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Percentage Calculator',
  description: 'Free percentage calculator - Calculate percentages easily. Find percentage of a number, percentage change, increase/decrease instantly. No signup required.',
  path: '/math/percentage',
  keywords: ['percentage calculator', 'percent calculator', 'percentage change', 'percentage increase', 'percentage decrease'],
})

export default function PercentagePage() {
  const relatedTools = [
    { name: 'Calculator', href: '/math/calculator' },
    { name: 'Unit Converter', href: '/math/unit-converter' },
    { name: 'BMI Calculator', href: '/math/bmi' },
    { name: 'Tip Calculator', href: '/math/tip' },
  ]

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Free percentage calculator - Calculate percentages easily. Find percentage of a number, percentage change, increase/decrease instantly. No signup required."
      category="math"
      categoryName="Math & Calculations"
      relatedTools={relatedTools}
    >
      <PercentageCalculator />
    </ToolLayout>
  )
} 