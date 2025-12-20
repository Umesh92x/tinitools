import { FileKey, QrCode, Scale } from 'lucide-react'
import CategoryLayout from '@/components/layout/CategoryLayout'

export const metadata = {
  title: 'File Tools - TiniTools',
  description: 'Collection of free online file tools including hash calculator, QR code generator, and file size converter.',
  keywords: 'file tools, hash calculator, qr code generator, file size converter, md5, sha1, sha256',
}

const tools = [
  {
    name: 'File Hash Calculator',
    description: 'Calculate MD5, SHA-1, and SHA-256 hashes of files',
    href: '/file/hash',
    icon: FileKey,
  },
  {
    name: 'QR Code Generator',
    description: 'Generate QR codes for text, URLs, and more',
    href: '/file/qr-code',
    icon: QrCode,
  },
  {
    name: 'File Size Converter',
    description: 'Convert between different file size units (KB/MB/GB)',
    href: '/file/size-converter',
    icon: Scale,
  },
]

export default function FileToolsPage() {
  return (
    <CategoryLayout
      title="File Tools"
      description="A collection of essential tools for file operations and conversions."
      tools={tools}
    />
  )
} 