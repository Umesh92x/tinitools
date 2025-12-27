import { Metadata } from 'next'
import { FileNameFormatter } from '@/components/tools/file/FileNameFormatter'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'File Name Formatter',
  description: 'Free file name formatter - Rename and format file names instantly. Batch rename files with prefixes, suffixes, timestamps, and more. No signup required.',
  path: '/file/name-formatter',
  keywords: ['file name formatter', 'batch rename files', 'file renamer', 'rename files online', 'file name converter'],
})

export default function FileNameFormatterPage() {
  const relatedTools = [
    { name: 'File Duplicate Checker', href: '/file/duplicate-checker' },
    { name: 'File Metadata Viewer', href: '/file/metadata' },
    { name: 'File Hash Calculator', href: '/file/hash' },
    { name: 'File Type Detector', href: '/file/type-detector' },
  ]

  return (
    <ToolLayout
      title="File Name Formatter"
      description="Free file name formatter - Rename and format file names instantly. Batch rename files with prefixes, suffixes, timestamps, and more. No signup required."
      category="file"
      categoryName="File Tools"
      relatedTools={relatedTools}
    >
      <FileNameFormatter />
    </ToolLayout>
  )
}

