import ToolLayout from '@/components/layout/ToolLayout'
import { EpochConverter } from '@/components/tools/datetime/EpochConverter'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Epoch Converter',
  description: 'Free epoch converter - Convert between Unix timestamps (epoch) and human-readable dates instantly. Supports milliseconds and seconds. No signup required.',
  path: '/datetime/epoch',
  keywords: ['epoch converter', 'unix timestamp', 'timestamp converter', 'date converter', 'time converter'],
})

export default function EpochConverterPage() {
  const relatedTools = [
    { name: 'Date Calculator', href: '/datetime/calculator' },
    { name: 'World Clock', href: '/datetime/world-clock' },
    { name: 'Countdown Timer', href: '/datetime/countdown' },
    { name: 'Business Days Calculator', href: '/datetime/business-days' },
  ]

  return (
    <ToolLayout
      title="Epoch Converter"
      description="Free epoch converter - Convert between Unix timestamps (epoch) and human-readable dates instantly. Supports milliseconds and seconds. No signup required."
      category="datetime"
      categoryName="Date & Time"
      relatedTools={relatedTools}
    >
      <EpochConverter />
    </ToolLayout>
  )
} 