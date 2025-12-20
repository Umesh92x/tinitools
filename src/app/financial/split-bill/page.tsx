import { SplitBillCalculator } from '@/components/tools/financial/SplitBillCalculator'
import { PageHeader } from '@/components/layout/PageHeader'

export default function SplitBillCalculatorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        heading="Split Bill Calculator"
        text="Split bills easily among friends and family. Calculate who owes what and settle expenses fairly."
      />
      <div className="mt-8">
        <SplitBillCalculator />
      </div>
    </div>
  )
} 