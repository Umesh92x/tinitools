import { Metadata } from 'next'
import { FileHashCalculator } from '@/components/tools/file/FileHashCalculator'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'File Hash Calculator - Calculate MD5, SHA-1, SHA-256, SHA-512 Hashes',
  description: 'Free online tool to calculate MD5, SHA-1, SHA-256, and SHA-512 hash values of files. Verify file integrity and authenticity.',
  keywords: 'file hash calculator, md5 hash, sha1 hash, sha256 hash, sha512 hash, file checksum, hash generator',
}

export default function FileHashPage() {
  return (
    <ToolLayout
      title="File Hash Calculator"
      description="Calculate MD5, SHA-1, SHA-256, and SHA-512 hash values of files. Verify file integrity and authenticity with hash comparison."
    >
      <FileHashCalculator />
    </ToolLayout>
  )
} 