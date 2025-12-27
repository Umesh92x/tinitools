import ToolLayout from '@/components/layout/ToolLayout'
import { QrCodeGenerator } from '@/components/tools/file/QrCodeGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'QR Code Generator',
  description: 'Free QR code generator - Create QR codes for social media profiles and links instantly. Generate QR codes for URLs, text, contact info, and more. No signup required.',
  path: '/social/qr-code',
  keywords: ['qr code generator', 'qr code', 'social media qr', 'qr code creator', 'qr code maker'],
})

export default function QrCodePage() {
  const relatedTools = [
    { name: 'Link Shortener', href: '/social/link-shortener' },
    { name: 'Share Generator', href: '/social/share-generator' },
    { name: 'Hashtag Generator', href: '/social/hashtags' },
    { name: 'Bio Generator', href: '/social/bio-generator' },
  ]

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Free QR code generator - Create QR codes for social media profiles and links instantly. Generate QR codes for URLs, text, contact info, and more. No signup required."
      category="social"
      categoryName="Social Media Tools"
      relatedTools={relatedTools}
    >
      <QrCodeGenerator />
    </ToolLayout>
  )
}

