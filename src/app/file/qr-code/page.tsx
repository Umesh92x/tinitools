import { Metadata } from 'next'
import { QrCodeGenerator } from '@/components/tools/file/QrCodeGenerator'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'QR Code Generator',
  description: 'Free QR code generator - Create QR codes for text, URLs, WiFi, vCard contacts, and more instantly. Customizable colors and sizes. No signup required.',
  path: '/file/qr-code',
  keywords: ['qr code generator', 'qr code maker', 'create qr code', 'qr code creator', 'qr code online', 'wifi qr code', 'vcard qr code'],
})

export default function QrCodePage() {
  const relatedTools = [
    { name: 'File Name Formatter', href: '/file/name-formatter' },
    { name: 'File Metadata Viewer', href: '/file/metadata' },
    { name: 'File Hash Calculator', href: '/file/hash' },
    { name: 'Link Shortener', href: '/social/link-shortener' },
  ]

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Free QR code generator - Create QR codes for text, URLs, WiFi, vCard contacts, and more instantly. Customizable colors and sizes. No signup required."
      category="file"
      categoryName="File Tools"
      relatedTools={relatedTools}
    >
      <QrCodeGenerator />
    </ToolLayout>
  )
} 