import ToolLayout from '@/components/layout/ToolLayout'
import { EMICalculator } from '@/components/tools/math/EMICalculator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'EMI Calculator',
  description: 'Free EMI calculator - Calculate loan payments instantly. Get detailed amortization schedule. 100% free, no registration needed.',
  path: '/financial/emi',
  keywords: ['emi calculator', 'loan emi calculator', 'monthly payment calculator', 'loan calculator', 'mortgage calculator'],
})

export default function EMIPage() {
  const relatedTools = [
    { name: 'GST Calculator', href: '/financial/gst' },
    { name: 'Tax Calculator', href: '/financial/tax' },
    { name: 'Investment Calculator', href: '/financial/investment' },
    { name: 'Compound Interest Calculator', href: '/financial/compound-interest' },
  ]

  return (
    <ToolLayout
      title="EMI Calculator"
      description="Free EMI calculator - Calculate loan payments instantly. Get detailed amortization schedule. 100% free, no registration needed."
      category="financial"
      categoryName="Financial Tools"
      relatedTools={relatedTools}
    >
      <EMICalculator />
    </ToolLayout>
  )
} 