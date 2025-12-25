import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFToImage } from '@/components/tools/pdf/PDFToImage'

export const metadata: Metadata = generateMetadata({
  title: 'PDF to Image Converter',
  description: 'Convert PDF pages to high-quality images. Support for PNG, JPEG formats and custom DPI settings.',
  path: '/pdf/to-image',
  keywords: ['pdf to image', 'pdf converter', 'pdf to png', 'pdf to jpg'],
})

export default function PDFToImagePage() {
  return (
    <ToolLayout
      title="PDF to Image Converter"
      description="Convert PDF pages to high-quality images. Support for PNG, JPEG formats and custom DPI settings."
    >
      <PDFToImage />
    </ToolLayout>
  )
} 