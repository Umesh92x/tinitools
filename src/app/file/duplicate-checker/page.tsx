import { Metadata } from 'next'
import { FileDuplicateChecker } from '@/components/tools/file/FileDuplicateChecker'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'File Duplicate Checker',
  description: 'Free file duplicate checker - Find duplicate files by comparing their hash values instantly. Upload multiple files to detect duplicates. No signup required.',
  path: '/file/duplicate-checker',
  keywords: ['duplicate file finder', 'file duplicate checker', 'find duplicate files', 'file comparison', 'hash comparison'],
})

export default function FileDuplicateCheckerPage() {
  const relatedTools = [
    { name: 'File Hash Calculator', href: '/file/hash' },
    { name: 'File Metadata Viewer', href: '/file/metadata' },
    { name: 'File Type Detector', href: '/file/type-detector' },
    { name: 'File Name Formatter', href: '/file/name-formatter' },
  ]

  return (
    <ToolLayout
      title="File Duplicate Checker"
      description="Free file duplicate checker - Find duplicate files by comparing their hash values instantly. Upload multiple files to detect duplicates. No signup required."
      category="file"
      categoryName="File Tools"
      relatedTools={relatedTools}
    >
      <FileDuplicateChecker />
    </ToolLayout>
  )
}

