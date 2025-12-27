import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { TextToPDF } from '@/components/tools/pdf/TextToPDF'

export const metadata: Metadata = generateMetadata({
  title: 'Text to PDF',
  description: 'Free text to PDF converter - Convert text documents to PDF format instantly. Customize font, margins, colors, and page settings. No signup required.',
  path: '/pdf/from-text',
  keywords: ['text to pdf', 'convert text', 'create pdf', 'pdf creator'],
})

export default function TextToPDFPage() {
  const relatedTools = [
    { name: 'PDF Merger', href: '/pdf/merge' },
    { name: 'PDF to Image', href: '/pdf/to-image' },
    { name: 'PDF Splitter', href: '/pdf/split' },
    { name: 'PDF Rotate', href: '/pdf/rotate' },
  ]

  return (
    <ToolLayout
      title="Text to PDF"
      description="Free text to PDF converter - Convert text documents to PDF format instantly. Customize font, margins, colors, and page settings. No signup required."
      category="pdf"
      categoryName="PDF Tools"
      relatedTools={relatedTools}
    >
      <TextToPDF />
    </ToolLayout>
  )
} 