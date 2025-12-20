import ToolLayout from '@/components/layout/ToolLayout'
import { PercentageCalculator } from '@/components/tools/math/PercentageCalculator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Percentage Calculator',
  description: 'Calculate percentages easily. Find percentage of a number, percentage change, increase/decrease, and more.',
  keywords: ['percentage calculator', 'percent calculator', 'percentage change', 'percentage increase', 'percentage decrease'],
})

export default function PercentagePage() {
  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Calculate percentages easily. Find percentage of a number, percentage change, increase/decrease, and more."
    >
      <PercentageCalculator />
    </ToolLayout>
  )
} 