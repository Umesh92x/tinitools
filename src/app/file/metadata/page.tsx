import { Metadata } from 'next'
import { FileMetadataViewer } from '@/components/tools/file/FileMetadataViewer'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'File Metadata Viewer - View File Information',
  description: 'Free online tool to view detailed file metadata including size, type, MIME type, dimensions, and more.',
  keywords: 'file metadata viewer, file information, file details, mime type checker, file properties',
}

export default function FileMetadataPage() {
  return (
    <ToolLayout
      title="File Metadata Viewer"
      description="View detailed file metadata including size, type, MIME type, dimensions (for images), and more."
    >
      <FileMetadataViewer />
    </ToolLayout>
  )
}

