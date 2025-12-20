import { CompoundInterestCalculator } from '@/components/tools/financial/CompoundInterestCalculator'
import { PageHeader } from '@/components/layout/PageHeader'

export default function CompoundInterestCalculatorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        heading="Compound Interest Calculator"
        text="Calculate compound interest with different compounding frequencies. See year-by-year breakdown of your investment growth."
      />
      <div className="mt-8">
        <CompoundInterestCalculator />
      </div>
    </div>
  )
} 