import { Metadata } from 'next'
import { FileDuplicateChecker } from '@/components/tools/file/FileDuplicateChecker'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'File Duplicate Checker - Find Duplicate Files',
  description: 'Free online tool to find duplicate files by comparing their hash values. Upload multiple files to detect duplicates.',
  keywords: 'duplicate file finder, file duplicate checker, find duplicate files, file comparison, hash comparison',
}

export default function FileDuplicateCheckerPage() {
  return (
    <ToolLayout
      title="File Duplicate Checker"
      description="Find duplicate files by comparing their hash values. Upload multiple files to detect duplicates instantly."
    >
      <FileDuplicateChecker />
    </ToolLayout>
  )
}

