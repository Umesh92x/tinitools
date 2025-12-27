import { CompoundInterestCalculator } from '@/components/tools/financial/CompoundInterestCalculator'
import { PageHeader } from '@/components/layout/PageHeader'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export default function CompoundInterestCalculatorPage() {
  const relatedTools = [
    { name: 'Investment Calculator', href: '/financial/investment' },
    { name: 'EMI Calculator', href: '/financial/emi' },
    { name: 'Tax Calculator', href: '/financial/tax' },
    { name: 'Currency Converter', href: '/financial/currency' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Compound Interest Calculator"
        description="Free compound interest calculator - Calculate investment growth with different compounding frequencies. See year-by-year breakdown. No signup required."
        category="Financial Tools"
        url="/financial/compound-interest"
      />
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Financial Tools', href: '/financial' },
          { label: 'Compound Interest Calculator' },
        ]} />
        <PageHeader
          heading="Compound Interest Calculator"
          text="Free compound interest calculator - Calculate investment growth with different compounding frequencies. See year-by-year breakdown. No signup required."
        />
        <div className="mt-8">
          <CompoundInterestCalculator />
        </div>
        <RelatedTools tools={relatedTools} currentTool="/financial/compound-interest" />
      </div>
    </>
  )
} 