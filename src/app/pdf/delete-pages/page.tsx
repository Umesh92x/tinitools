import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFPageDelete } from '@/components/tools/pdf/PDFPageDelete'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Page Delete',
  description: 'Free PDF page delete tool - Remove specific pages from PDF documents instantly. Delete page ranges or individual pages. No signup required.',
  path: '/pdf/delete-pages',
  keywords: ['pdf delete pages', 'remove pdf pages', 'pdf page remover'],
})

export default function PDFPageDeletePage() {
  const relatedTools = [
    { name: 'PDF Splitter', href: '/pdf/split' },
    { name: 'PDF Merger', href: '/pdf/merge' },
    { name: 'PDF Rotate', href: '/pdf/rotate' },
    { name: 'PDF to Image', href: '/pdf/to-image' },
  ]

  return (
    <ToolLayout
      title="PDF Page Delete"
      description="Free PDF page delete tool - Remove specific pages from PDF documents instantly. Delete page ranges or individual pages. No signup required."
      category="pdf"
      categoryName="PDF Tools"
      relatedTools={relatedTools}
    >
      <PDFPageDelete />
    </ToolLayout>
  )
}

