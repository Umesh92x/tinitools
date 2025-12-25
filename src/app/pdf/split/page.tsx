import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFSplitter } from '@/components/tools/pdf/PDFSplitter'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Splitter',
  description: 'Split PDF files into multiple documents. Extract pages by range or split into individual pages.',
  path: '/pdf/split',
  keywords: ['pdf splitter', 'split pdf', 'extract pages', 'pdf pages'],
})

export default function PDFSplitterPage() {
  return (
    <ToolLayout
      title="PDF Splitter"
      description="Split PDF files into multiple documents. Extract pages by range or split into individual pages."
    >
      <PDFSplitter />
    </ToolLayout>
  )
}

