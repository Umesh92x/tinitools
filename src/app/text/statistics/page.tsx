import ToolLayout from '@/components/layout/ToolLayout'
import { TextStatistics } from '@/components/tools/text/TextStatistics'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Text Statistics',
  description: 'Free text analyzer - Get word count, character count, sentence count, and readability stats instantly. No signup required.',
  path: '/text/statistics',
  keywords: ['text statistics', 'word count', 'character count', 'text analyzer', 'readability'],
})

export default function TextStatisticsPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Text Diff Checker', href: '/text/diff' },
    { name: 'Line Break Remover', href: '/text/line-breaks' },
    { name: 'Password Generator', href: '/text/password' },
  ]

  return (
    <ToolLayout
      title="Text Statistics"
      description="Free text analyzer - Get word count, character count, sentence count, and readability stats instantly. No signup required."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <TextStatistics />
    </ToolLayout>
  )
} 