import { Metadata } from 'next'
import { FileSizeConverter } from '@/components/tools/file/FileSizeConverter'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'File Size Converter - Convert Between KB, MB, GB, TB, PB',
  description: 'Free online file size converter. Convert between different file size units like B, KB, MB, GB, TB, PB with quick presets.',
  keywords: 'file size converter, kb to mb, mb to gb, file size calculator, byte converter',
}

export default function FileSizeConverterPage() {
  return (
    <ToolLayout
      title="File Size Converter"
      description="Convert between different file size units (B, KB, MB, GB, TB, PB) with quick presets and copy functionality."
    >
      <FileSizeConverter />
    </ToolLayout>
  )
} 