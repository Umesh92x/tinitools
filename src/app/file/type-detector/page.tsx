import { Metadata } from 'next'
import { FileTypeDetector } from '@/components/tools/file/FileTypeDetector'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'File Type Detector',
  description: 'Free file type detector - Detect file types, MIME types, extensions, and metadata instantly. Identify any file format. No signup required.',
  path: '/file/type-detector',
  keywords: ['file type detector', 'mime type checker', 'file format identifier', 'file extension detector'],
})

export default function FileTypeDetectorPage() {
  const relatedTools = [
    { name: 'File Metadata Viewer', href: '/file/metadata' },
    { name: 'File Hash Calculator', href: '/file/hash' },
    { name: 'File Size Converter', href: '/file/size-converter' },
    { name: 'File Duplicate Checker', href: '/file/duplicate-checker' },
  ]

  return (
    <ToolLayout
      title="File Type Detector"
      description="Free file type detector - Detect file types, MIME types, extensions, and metadata instantly. Identify any file format. No signup required."
      category="file"
      categoryName="File Tools"
      relatedTools={relatedTools}
    >
      <FileTypeDetector />
    </ToolLayout>
  )
}

