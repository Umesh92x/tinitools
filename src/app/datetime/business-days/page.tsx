import ToolLayout from '@/components/layout/ToolLayout'
import { BusinessDaysCalculator } from '@/components/tools/datetime/BusinessDaysCalculator'

export const metadata = {
  title: 'Business Days Calculator',
  description: 'Calculate working days between two dates, excluding weekends and holidays.',
}

export default function BusinessDaysPage() {
  return (
    <ToolLayout
      title="Business Days Calculator"
      description="Calculate the number of business days between two dates. Exclude weekends and custom holidays."
    >
      <BusinessDaysCalculator />
    </ToolLayout>
  )
} 