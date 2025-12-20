import ToolLayout from '@/components/layout/ToolLayout'
import { LineBreakRemover } from '@/components/tools/text/LineBreakRemover'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Line Break Remover',
  description: 'Remove line breaks from text. Convert multiple lines into a single line or paragraphs.',
  keywords: ['line break remover', 'remove line breaks', 'text formatter', 'paragraph formatter'],
})

export default function LineBreakRemoverPage() {
  return (
    <ToolLayout
      title="Line Break Remover"
      description="Remove line breaks from text. Convert multiple lines into a single line or paragraphs."
    >
      <LineBreakRemover />
    </ToolLayout>
  )
} 