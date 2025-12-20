import ToolLayout from '@/components/layout/ToolLayout'
import { EpochConverter } from '@/components/tools/datetime/EpochConverter'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Epoch Converter',
  description: 'Convert between Unix timestamps (epoch) and human-readable dates. Supports milliseconds and seconds.',
  keywords: ['epoch converter', 'unix timestamp', 'timestamp converter', 'date converter', 'time converter'],
})

export default function EpochConverterPage() {
  return (
    <ToolLayout
      title="Epoch Converter"
      description="Convert between Unix timestamps (epoch) and human-readable dates. Supports milliseconds and seconds."
    >
      <EpochConverter />
    </ToolLayout>
  )
} 