import ToolLayout from '@/components/layout/ToolLayout'
import { GSTCalculator } from '@/components/tools/math/GSTCalculator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'GST Calculator',
  description: 'Free GST calculator - Calculate Goods and Services Tax instantly. Support for different GST rates and reverse calculations. 100% free, no signup required.',
  path: '/financial/gst',
  keywords: ['gst calculator', 'tax calculator', 'goods and services tax', 'gst rate calculator', 'gst inclusive calculator'],
})

export default function GSTPage() {
  const relatedTools = [
    { name: 'EMI Calculator', href: '/financial/emi' },
    { name: 'Tax Calculator', href: '/financial/tax' },
    { name: 'Currency Converter', href: '/financial/currency' },
    { name: 'Investment Calculator', href: '/financial/investment' },
  ]

  return (
    <ToolLayout
      title="GST Calculator"
      description="Free GST calculator - Calculate Goods and Services Tax instantly. Support for different GST rates and reverse calculations. 100% free, no signup required."
      category="financial"
      categoryName="Financial Tools"
      relatedTools={relatedTools}
    >
      <GSTCalculator />
    </ToolLayout>
  )
} 