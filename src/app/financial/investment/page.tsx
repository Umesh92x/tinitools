import { InvestmentCalculator } from '@/components/tools/financial/InvestmentCalculator'
import { PageHeader } from '@/components/layout/PageHeader'

export default function InvestmentCalculatorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        heading="Investment Calculator"
        text="Plan your investments and see how your money grows over time. Compare different investment types and understand potential returns."
      />
      <div className="mt-8">
        <InvestmentCalculator />
      </div>
    </div>
  )
} 