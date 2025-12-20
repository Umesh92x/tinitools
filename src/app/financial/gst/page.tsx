import ToolLayout from '@/components/layout/ToolLayout'
import { GSTCalculator } from '@/components/tools/math/GSTCalculator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'GST Calculator',
  description: 'Calculate GST (Goods and Services Tax) amount and final price. Support for different GST rates and reverse calculations.',
  keywords: ['gst calculator', 'tax calculator', 'goods and services tax', 'gst rate calculator', 'gst inclusive calculator'],
})

export default function GSTPage() {
  return (
    <ToolLayout
      title="GST Calculator"
      description="Calculate GST (Goods and Services Tax) amount and final price. Support for different GST rates and reverse calculations."
    >
      <GSTCalculator />
    </ToolLayout>
  )
} 