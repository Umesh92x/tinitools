import { InvestmentCalculator } from '@/components/tools/financial/InvestmentCalculator'
import { PageHeader } from '@/components/layout/PageHeader'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export default function InvestmentCalculatorPage() {
  const relatedTools = [
    { name: 'EMI Calculator', href: '/financial/emi' },
    { name: 'Compound Interest Calculator', href: '/financial/compound-interest' },
    { name: 'Tax Calculator', href: '/financial/tax' },
    { name: 'Currency Converter', href: '/financial/currency' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Investment Calculator"
        description="Free investment calculator - Calculate potential returns on investments. Compare different types and see year-by-year growth projections. 100% free."
        category="Financial Tools"
        url="/financial/investment"
      />
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Financial Tools', href: '/financial' },
          { label: 'Investment Calculator' },
        ]} />
        <PageHeader
          heading="Investment Calculator"
          text="Free investment calculator - Calculate potential returns on investments. Compare different types and see year-by-year growth projections. 100% free."
        />
        <div className="mt-8">
          <InvestmentCalculator />
        </div>
        <RelatedTools tools={relatedTools} currentTool="/financial/investment" />
      </div>
    </>
  )
} 