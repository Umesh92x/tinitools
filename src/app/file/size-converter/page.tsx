import { Metadata } from 'next'
import { FileSizeConverter } from '@/components/tools/file/FileSizeConverter'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'File Size Converter',
  description: 'Free file size converter - Convert between different file size units like B, KB, MB, GB, TB, PB instantly. Quick presets available. No signup required.',
  path: '/file/size-converter',
  keywords: ['file size converter', 'kb to mb', 'mb to gb', 'file size calculator', 'byte converter'],
})

export default function FileSizeConverterPage() {
  const relatedTools = [
    { name: 'File Hash Calculator', href: '/file/hash' },
    { name: 'File Metadata Viewer', href: '/file/metadata' },
    { name: 'File Type Detector', href: '/file/type-detector' },
    { name: 'Unit Converter', href: '/math/unit-converter' },
  ]

  return (
    <ToolLayout
      title="File Size Converter"
      description="Free file size converter - Convert between different file size units like B, KB, MB, GB, TB, PB instantly. Quick presets available. No signup required."
      category="file"
      categoryName="File Tools"
      relatedTools={relatedTools}
    >
      <FileSizeConverter />
    </ToolLayout>
  )
} 