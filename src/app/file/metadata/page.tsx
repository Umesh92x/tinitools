import { Metadata } from 'next'
import { FileMetadataViewer } from '@/components/tools/file/FileMetadataViewer'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'File Metadata Viewer',
  description: 'Free file metadata viewer - View detailed file metadata including size, type, MIME type, dimensions, and more instantly. No signup required.',
  path: '/file/metadata',
  keywords: ['file metadata viewer', 'file information', 'file details', 'mime type checker', 'file properties'],
})

export default function FileMetadataPage() {
  const relatedTools = [
    { name: 'File Type Detector', href: '/file/type-detector' },
    { name: 'File Hash Calculator', href: '/file/hash' },
    { name: 'File Size Converter', href: '/file/size-converter' },
    { name: 'File Duplicate Checker', href: '/file/duplicate-checker' },
  ]

  return (
    <ToolLayout
      title="File Metadata Viewer"
      description="Free file metadata viewer - View detailed file metadata including size, type, MIME type, dimensions, and more instantly. No signup required."
      category="file"
      categoryName="File Tools"
      relatedTools={relatedTools}
    >
      <FileMetadataViewer />
    </ToolLayout>
  )
}

