import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFToImage } from '@/components/tools/pdf/PDFToImage'

export const metadata: Metadata = generateMetadata({
  title: 'PDF to Image Converter',
  description: 'Free PDF to image converter - Convert PDF pages to high-quality PNG, JPEG images instantly. Custom DPI settings. No signup required.',
  path: '/pdf/to-image',
  keywords: ['pdf to image', 'pdf converter', 'pdf to png', 'pdf to jpg'],
})

export default function PDFToImagePage() {
  const relatedTools = [
    { name: 'PDF Merger', href: '/pdf/merge' },
    { name: 'PDF Splitter', href: '/pdf/split' },
    { name: 'Text to PDF', href: '/pdf/from-text' },
    { name: 'PDF Rotate', href: '/pdf/rotate' },
  ]

  return (
    <ToolLayout
      title="PDF to Image Converter"
      description="Free PDF to image converter - Convert PDF pages to high-quality PNG, JPEG images instantly. Custom DPI settings. No signup required."
      category="pdf"
      categoryName="PDF Tools"
      relatedTools={relatedTools}
    >
      <PDFToImage />
    </ToolLayout>
  )
} 