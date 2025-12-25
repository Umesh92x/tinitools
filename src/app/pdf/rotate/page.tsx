import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFRotate } from '@/components/tools/pdf/PDFRotate'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Rotate',
  description: 'Rotate pages in PDF documents. Rotate all pages or specific pages by 90°, 180°, or 270°.',
  path: '/pdf/rotate',
  keywords: ['pdf rotate', 'rotate pdf pages', 'pdf orientation'],
})

export default function PDFRotatePage() {
  return (
    <ToolLayout
      title="PDF Rotate"
      description="Rotate pages in PDF documents. Rotate all pages or specific pages by 90°, 180°, or 270°."
    >
      <PDFRotate />
    </ToolLayout>
  )
}

