import ToolLayout from '@/components/layout/ToolLayout'
import { DateCalculator } from '@/components/tools/datetime/DateCalculator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Date Calculator',
  description: 'Calculate the difference between dates or add/subtract days, months, and years from a date.',
  keywords: ['date calculator', 'date difference', 'add days', 'subtract days', 'date math'],
})

export default function DateCalculatorPage() {
  return (
    <ToolLayout
      title="Date Calculator"
      description="Calculate the difference between dates or add/subtract days, months, and years from a date."
    >
      <DateCalculator />
    </ToolLayout>
  )
} 