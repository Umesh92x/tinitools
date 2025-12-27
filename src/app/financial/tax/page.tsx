import { TaxCalculator } from '@/components/tools/financial/TaxCalculator'
import { PageHeader } from '@/components/layout/PageHeader'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export default function TaxCalculatorPage() {
  const relatedTools = [
    { name: 'EMI Calculator', href: '/financial/emi' },
    { name: 'GST Calculator', href: '/financial/gst' },
    { name: 'Investment Calculator', href: '/financial/investment' },
    { name: 'Compound Interest Calculator', href: '/financial/compound-interest' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Income Tax Calculator"
        description="Free income tax calculator - Calculate your tax liability based on latest tax slabs. Account for deductions and see effective tax rate. No signup required."
        category="Financial Tools"
        url="/financial/tax"
      />
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Financial Tools', href: '/financial' },
          { label: 'Income Tax Calculator' },
        ]} />
        <PageHeader
          heading="Income Tax Calculator"
          text="Free income tax calculator - Calculate your tax liability based on latest tax slabs. Account for deductions and see effective tax rate. No signup required."
        />
        <div className="mt-8">
          <TaxCalculator />
        </div>
        <RelatedTools tools={relatedTools} currentTool="/financial/tax" />
      </div>
    </>
  )
} 