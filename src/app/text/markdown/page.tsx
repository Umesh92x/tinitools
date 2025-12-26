import ToolLayout from '@/components/layout/ToolLayout'
import { MarkdownPreview } from '@/components/tools/text/MarkdownPreview'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Markdown Preview',
  description: 'Free markdown editor - Live preview with GitHub Flavored Markdown support. Edit and preview markdown instantly. No signup required.',
  path: '/text/markdown',
  keywords: ['markdown preview', 'markdown editor', 'live preview', 'markdown to html', 'markdown converter'],
})

export default function MarkdownPreviewPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Text Statistics', href: '/text/statistics' },
    { name: 'Text Diff Checker', href: '/text/diff' },
    { name: 'Line Break Remover', href: '/text/line-breaks' },
  ]

  return (
    <ToolLayout
      title="Markdown Preview"
      description="Free markdown editor - Live preview with GitHub Flavored Markdown support. Edit and preview markdown instantly. No signup required."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <MarkdownPreview />
    </ToolLayout>
  )
} 