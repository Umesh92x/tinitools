import ToolLayout from '@/components/layout/ToolLayout'
import { MarkdownPreview } from '@/components/tools/text/MarkdownPreview'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Markdown Preview',
  description: 'Live markdown editor with instant preview. Supports GitHub Flavored Markdown and common extensions.',
  keywords: ['markdown preview', 'markdown editor', 'live preview', 'markdown to html', 'markdown converter'],
})

export default function MarkdownPreviewPage() {
  return (
    <ToolLayout
      title="Markdown Preview"
      description="Live markdown editor with instant preview. Supports GitHub Flavored Markdown and common extensions."
    >
      <MarkdownPreview />
    </ToolLayout>
  )
} 