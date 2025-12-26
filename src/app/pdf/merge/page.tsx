import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFMerger } from '@/components/tools/pdf/PDFMerger'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Merger',
  description: 'Free PDF merger - Combine multiple PDF files into one instantly. Arrange pages, set custom order. 100% free, no watermarks.',
  path: '/pdf/merge',
  keywords: ['pdf merger', 'combine pdf', 'merge pdf files', 'pdf combiner'],
})

export default function PDFMergerPage() {
  const relatedTools = [
    { name: 'PDF Splitter', href: '/pdf/split' },
    { name: 'PDF to Image', href: '/pdf/to-image' },
    { name: 'Text to PDF', href: '/pdf/from-text' },
    { name: 'PDF Rotate', href: '/pdf/rotate' },
  ]

  return (
    <ToolLayout
      title="PDF Merger"
      description="Free PDF merger - Combine multiple PDF files into one instantly. Arrange pages, set custom order. 100% free, no watermarks."
      category="pdf"
      categoryName="PDF Tools"
      relatedTools={relatedTools}
    >
      <PDFMerger />
    </ToolLayout>
  )
} 