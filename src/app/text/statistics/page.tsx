import ToolLayout from '@/components/layout/ToolLayout'
import { TextStatistics } from '@/components/tools/text/TextStatistics'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Text Statistics',
  description: 'Analyze text to get word count, character count, sentence count, and more statistics.',
  keywords: ['text statistics', 'word count', 'character count', 'text analyzer', 'readability'],
})

export default function TextStatisticsPage() {
  return (
    <ToolLayout
      title="Text Statistics"
      description="Analyze text to get word count, character count, sentence count, and more statistics."
    >
      <TextStatistics />
    </ToolLayout>
  )
} 