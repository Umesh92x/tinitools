import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFSigner } from '@/components/tools/pdf/PDFSigner'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Sign Tool - Add Signature to PDF Online',
  description: 'Free PDF sign tool - Sign PDF documents online instantly. Draw your signature or upload a signature image and place it anywhere on your PDF. Free and secure.',
  path: '/pdf/sign',
  keywords: ['pdf sign', 'sign pdf', 'pdf signature', 'add signature to pdf', 'pdf signer', 'digital signature pdf'],
})

export default function PDFSignPage() {
  const relatedTools = [
    { name: 'PDF Merger', href: '/pdf/merge' },
    { name: 'PDF Splitter', href: '/pdf/split' },
    { name: 'PDF Rotate', href: '/pdf/rotate' },
    { name: 'PDF to Image', href: '/pdf/to-image' },
  ]

  return (
    <ToolLayout
      title="PDF Sign Tool"
      description="Free PDF sign tool - Sign PDF documents online instantly. Draw your signature or upload a signature image and place it anywhere on your PDF. Free and secure."
      category="pdf"
      categoryName="PDF Tools"
      relatedTools={relatedTools}
    >
      <PDFSigner />
    </ToolLayout>
  )
}

