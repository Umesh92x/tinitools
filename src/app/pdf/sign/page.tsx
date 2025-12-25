import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFSigner } from '@/components/tools/pdf/PDFSigner'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Sign Tool - Add Signature to PDF Online',
  description: 'Sign PDF documents online. Draw your signature or upload a signature image and place it anywhere on your PDF. Free and secure.',
  path: '/pdf/sign',
  keywords: ['pdf sign', 'sign pdf', 'pdf signature', 'add signature to pdf', 'pdf signer', 'digital signature pdf'],
})

export default function PDFSignPage() {
  return (
    <ToolLayout
      title="PDF Sign Tool"
      description="Sign PDF documents online. Draw your signature or upload a signature image and place it anywhere on your PDF. Free and secure."
    >
      <PDFSigner />
    </ToolLayout>
  )
}

