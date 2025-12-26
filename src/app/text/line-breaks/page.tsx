import ToolLayout from '@/components/layout/ToolLayout'
import { LineBreakRemover } from '@/components/tools/text/LineBreakRemover'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Line Break Remover',
  description: 'Free online line break remover - Clean up text by removing line breaks instantly. Convert multiple lines to single line. No signup required.',
  path: '/text/line-breaks',
  keywords: ['line break remover', 'remove line breaks', 'text formatter', 'paragraph formatter'],
})

export default function LineBreakRemoverPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Text Statistics', href: '/text/statistics' },
    { name: 'Text Diff Checker', href: '/text/diff' },
    { name: 'Password Generator', href: '/text/password' },
  ]

  return (
    <ToolLayout
      title="Line Break Remover"
      description="Free online line break remover - Clean up text by removing line breaks instantly. Convert multiple lines to single line. No signup required."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <LineBreakRemover />
    </ToolLayout>
  )
} 