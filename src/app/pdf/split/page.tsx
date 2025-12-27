import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFSplitter } from '@/components/tools/pdf/PDFSplitter'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Splitter',
  description: 'Free PDF splitter - Split PDF files into multiple documents instantly. Extract pages by range or split into individual pages. No signup required.',
  path: '/pdf/split',
  keywords: ['pdf splitter', 'split pdf', 'extract pages', 'pdf pages'],
})

export default function PDFSplitterPage() {
  const relatedTools = [
    { name: 'PDF Merger', href: '/pdf/merge' },
    { name: 'PDF to Image', href: '/pdf/to-image' },
    { name: 'Text to PDF', href: '/pdf/from-text' },
    { name: 'PDF Rotate', href: '/pdf/rotate' },
  ]

  return (
    <ToolLayout
      title="PDF Splitter"
      description="Free PDF splitter - Split PDF files into multiple documents instantly. Extract pages by range or split into individual pages. No signup required."
      category="pdf"
      categoryName="PDF Tools"
      relatedTools={relatedTools}
    >
      <PDFSplitter />
    </ToolLayout>
  )
}

