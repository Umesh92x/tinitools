import { Metadata } from 'next'
import { QrCodeGenerator } from '@/components/tools/file/QrCodeGenerator'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'QR Code Generator - Create QR Codes Online',
  description: 'Free online QR code generator. Create QR codes for text, URLs, WiFi, vCard contacts, and more with customizable colors and sizes.',
  keywords: 'qr code generator, qr code maker, create qr code, qr code creator, qr code online, wifi qr code, vcard qr code',
}

export default function QrCodePage() {
  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create QR codes for text, URLs, WiFi networks, vCard contacts, and more. Customize colors, size, and error correction level."
    >
      <QrCodeGenerator />
    </ToolLayout>
  )
} 