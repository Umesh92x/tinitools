import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { TextToPDF } from '@/components/tools/pdf/TextToPDF'

export const metadata: Metadata = generateMetadata({
  title: 'Text to PDF',
  description: 'Convert text documents to PDF format. Customize font, margins, and page settings.',
  path: '/pdf/from-text',
  keywords: ['text to pdf', 'convert text', 'create pdf', 'pdf creator'],
})

export default function TextToPDFPage() {
  return (
    <ToolLayout
      title="Text to PDF"
      description="Convert text documents to PDF format. Customize font, margins, colors, and page settings."
    >
      <TextToPDF />
    </ToolLayout>
  )
} 