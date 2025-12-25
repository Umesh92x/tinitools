import { Metadata } from 'next'
import { FileNameFormatter } from '@/components/tools/file/FileNameFormatter'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'File Name Formatter - Rename and Format File Names',
  description: 'Free online tool to rename and format file names. Batch rename files with prefixes, suffixes, timestamps, and more.',
  keywords: 'file name formatter, batch rename files, file renamer, rename files online, file name converter',
}

export default function FileNameFormatterPage() {
  return (
    <ToolLayout
      title="File Name Formatter"
      description="Rename and format file names in bulk. Add prefixes, suffixes, timestamps, counters, and apply various formatting options."
    >
      <FileNameFormatter />
    </ToolLayout>
  )
}

