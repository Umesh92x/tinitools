import { SplitBillCalculator } from '@/components/tools/financial/SplitBillCalculator'
import { PageHeader } from '@/components/layout/PageHeader'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export default function SplitBillCalculatorPage() {
  const relatedTools = [
    { name: 'EMI Calculator', href: '/financial/emi' },
    { name: 'Tax Calculator', href: '/financial/tax' },
    { name: 'Currency Converter', href: '/financial/currency' },
    { name: 'Tip Calculator', href: '/math/tip' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Split Bill Calculator"
        description="Free split bill calculator - Split expenses easily among friends and family. Calculate who owes what instantly. No signup required."
        category="Financial Tools"
        url="/financial/split-bill"
      />
      <div className="container mx-auto py-8 px-4">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Financial Tools', href: '/financial' },
          { label: 'Split Bill Calculator' },
        ]} />
        <PageHeader
          heading="Split Bill Calculator"
          text="Free split bill calculator - Split expenses easily among friends and family. Calculate who owes what instantly. No signup required."
        />
        <div className="mt-8">
          <SplitBillCalculator />
        </div>
        <RelatedTools tools={relatedTools} currentTool="/financial/split-bill" />
      </div>
    </>
  )
} 