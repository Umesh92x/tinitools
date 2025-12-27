import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFRotate } from '@/components/tools/pdf/PDFRotate'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Rotate',
  description: 'Free PDF rotate tool - Rotate pages in PDF documents instantly. Rotate all pages or specific pages by 90°, 180°, or 270°. No signup required.',
  path: '/pdf/rotate',
  keywords: ['pdf rotate', 'rotate pdf pages', 'pdf orientation'],
})

export default function PDFRotatePage() {
  const relatedTools = [
    { name: 'PDF Merger', href: '/pdf/merge' },
    { name: 'PDF Splitter', href: '/pdf/split' },
    { name: 'PDF to Image', href: '/pdf/to-image' },
    { name: 'PDF Page Delete', href: '/pdf/delete-pages' },
  ]

  return (
    <ToolLayout
      title="PDF Rotate"
      description="Free PDF rotate tool - Rotate pages in PDF documents instantly. Rotate all pages or specific pages by 90°, 180°, or 270°. No signup required."
      category="pdf"
      categoryName="PDF Tools"
      relatedTools={relatedTools}
    >
      <PDFRotate />
    </ToolLayout>
  )
}

