import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  FileImage,
  Merge,
  FileText
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Tools',
  description: 'Free online tools for working with PDF files. Merge, split, compress, and convert PDFs.',
  path: '/pdf',
  keywords: ['pdf tools', 'pdf converter', 'pdf to image', 'pdf merger', 'text to pdf'],
})

export default function PDFTools() {
const tools = [
  {
      title: 'PDF to Image',
    description: 'Convert PDF pages to high-quality images. Support for PNG, JPEG formats and custom DPI settings.',
    href: '/pdf/to-image',
      icon: FileImage,
  },
  {
      title: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document. Arrange pages and set custom order.',
    href: '/pdf/merge',
      icon: Merge,
  },
  {
      title: 'Text to PDF',
    description: 'Convert text documents to PDF format. Customize font, margins, and page settings.',
    href: '/pdf/from-text',
      icon: FileText,
    }
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          PDF Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Free online tools for working with PDF files. Merge, split, compress, and convert PDFs.
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 