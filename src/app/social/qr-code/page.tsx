import ToolLayout from '@/components/layout/ToolLayout'
import { QrCodeGenerator } from '@/components/tools/file/QrCodeGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'QR Code Generator',
  description: 'Create QR codes for social media profiles and links. Generate QR codes for URLs, text, contact info, and more.',
  keywords: ['qr code generator', 'qr code', 'social media qr', 'qr code creator', 'qr code maker'],
})

export default function QrCodePage() {
  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create QR codes for social media profiles and links. Generate QR codes for URLs, text, contact info, and more."
    >
      <QrCodeGenerator />
    </ToolLayout>
  )
}

