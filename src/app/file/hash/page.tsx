import { Metadata } from 'next'
import { FileHashCalculator } from '@/components/tools/file/FileHashCalculator'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'File Hash Calculator',
  description: 'Free file hash calculator - Calculate MD5, SHA-1, SHA-256, and SHA-512 hash values of files instantly. Verify file integrity and authenticity. No signup required.',
  path: '/file/hash',
  keywords: ['file hash calculator', 'md5 hash', 'sha1 hash', 'sha256 hash', 'sha512 hash', 'file checksum', 'hash generator'],
})

export default function FileHashPage() {
  const relatedTools = [
    { name: 'File Duplicate Checker', href: '/file/duplicate-checker' },
    { name: 'File Metadata Viewer', href: '/file/metadata' },
    { name: 'File Type Detector', href: '/file/type-detector' },
    { name: 'File Size Converter', href: '/file/size-converter' },
  ]

  return (
    <ToolLayout
      title="File Hash Calculator"
      description="Free file hash calculator - Calculate MD5, SHA-1, SHA-256, and SHA-512 hash values of files instantly. Verify file integrity and authenticity. No signup required."
      category="file"
      categoryName="File Tools"
      relatedTools={relatedTools}
    >
      <FileHashCalculator />
    </ToolLayout>
  )
} 