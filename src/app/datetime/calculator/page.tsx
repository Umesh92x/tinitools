import ToolLayout from '@/components/layout/ToolLayout'
import { DateCalculator } from '@/components/tools/datetime/DateCalculator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Date Calculator',
  description: 'Free date calculator - Calculate the difference between dates or add/subtract days, months, and years from a date instantly. No signup required.',
  path: '/datetime/calculator',
  keywords: ['date calculator', 'date difference', 'add days', 'subtract days', 'date math'],
})

export default function DateCalculatorPage() {
  const relatedTools = [
    { name: 'Age Calculator', href: '/math/age' },
    { name: 'Business Days Calculator', href: '/datetime/business-days' },
    { name: 'Epoch Converter', href: '/datetime/epoch' },
    { name: 'World Clock', href: '/datetime/world-clock' },
  ]

  return (
    <ToolLayout
      title="Date Calculator"
      description="Free date calculator - Calculate the difference between dates or add/subtract days, months, and years from a date instantly. No signup required."
      category="datetime"
      categoryName="Date & Time"
      relatedTools={relatedTools}
    >
      <DateCalculator />
    </ToolLayout>
  )
} 