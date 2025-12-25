import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFMerger } from '@/components/tools/pdf/PDFMerger'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Merger',
  description: 'Combine multiple PDF files into a single document. Arrange pages and set custom order.',
  path: '/pdf/merge',
  keywords: ['pdf merger', 'combine pdf', 'merge pdf files', 'pdf combiner'],
})

export default function PDFMergerPage() {
  return (
    <ToolLayout
      title="PDF Merger"
      description="Combine multiple PDF files into a single document. Arrange pages and set custom order."
    >
      <PDFMerger />
    </ToolLayout>
  )
} 