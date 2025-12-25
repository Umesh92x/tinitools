import { FileKey, QrCode, Scale, FileSearch, FileText, Copy, FileEdit } from 'lucide-react'
import CategoryLayout from '@/components/layout/CategoryLayout'

export const metadata = {
  title: 'File Tools - TiniTools',
  description: 'Collection of free online file tools including hash calculator, QR code generator, file size converter, file type detector, duplicate checker, and more.',
  keywords: 'file tools, hash calculator, qr code generator, file size converter, file type detector, duplicate file finder, file renamer, md5, sha1, sha256',
}

const tools = [
  {
    name: 'File Hash Calculator',
    description: 'Calculate MD5, SHA-1, SHA-256, and SHA-512 hashes with verification',
    href: '/file/hash',
    icon: FileKey,
  },
  {
    name: 'QR Code Generator',
    description: 'Generate QR codes for text, URLs, WiFi, vCard contacts with customization',
    href: '/file/qr-code',
    icon: QrCode,
  },
  {
    name: 'File Size Converter',
    description: 'Convert between different file size units (B/KB/MB/GB/TB/PB/KiB/MiB/GiB) with presets',
    href: '/file/size-converter',
    icon: Scale,
  },
  {
    name: 'File Type Detector',
    description: 'Detect file types, MIME types, extensions, and metadata',
    href: '/file/type-detector',
    icon: FileSearch,
  },
  {
    name: 'File Metadata Viewer',
    description: 'View detailed file metadata including size, type, dimensions, and more',
    href: '/file/metadata',
    icon: FileText,
  },
  {
    name: 'File Duplicate Checker',
    description: 'Find duplicate files by comparing their hash values',
    href: '/file/duplicate-checker',
    icon: Copy,
  },
  {
    name: 'File Name Formatter',
    description: 'Batch rename files with prefixes, suffixes, timestamps, and formatting options',
    href: '/file/name-formatter',
    icon: FileEdit,
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