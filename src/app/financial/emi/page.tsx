import ToolLayout from '@/components/layout/ToolLayout'
import { EMICalculator } from '@/components/tools/math/EMICalculator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'EMI Calculator',
  description: 'Calculate EMI (Equated Monthly Installment) for loans. Find monthly payments, total interest, and loan breakup.',
  keywords: ['emi calculator', 'loan emi calculator', 'monthly payment calculator', 'loan calculator', 'mortgage calculator'],
})

export default function EMIPage() {
  return (
    <ToolLayout
      title="EMI Calculator"
      description="Calculate EMI (Equated Monthly Installment) for loans. Find monthly payments, total interest, and loan breakup."
    >
      <EMICalculator />
    </ToolLayout>
  )
} 