import { Metadata } from 'next'
import { FileTypeDetector } from '@/components/tools/file/FileTypeDetector'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'File Type Detector - Identify File Types and MIME Types',
  description: 'Free online tool to detect file types, MIME types, extensions, and metadata. Identify any file format instantly.',
  keywords: 'file type detector, mime type checker, file format identifier, file extension detector',
}

export default function FileTypeDetectorPage() {
  return (
    <ToolLayout
      title="File Type Detector"
      description="Detect file types, MIME types, extensions, and metadata. Identify any file format instantly."
    >
      <FileTypeDetector />
    </ToolLayout>
  )
}

