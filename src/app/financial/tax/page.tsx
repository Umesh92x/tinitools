import { TaxCalculator } from '@/components/tools/financial/TaxCalculator'
import { PageHeader } from '@/components/layout/PageHeader'

export default function TaxCalculatorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        heading="Income Tax Calculator"
        text="Calculate your income tax based on your income and deductions. This calculator uses the latest tax slabs and includes health & education cess."
      />
      <div className="mt-8">
        <TaxCalculator />
      </div>
    </div>
  )
} 