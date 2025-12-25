import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  FileImage,
  Merge,
  FileText,
  Scissors,
  RotateCw,
  Trash2,
  PenTool
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Tools',
  description: 'Free online tools for working with PDF files. Merge, split, rotate, delete pages, and convert PDFs.',
  path: '/pdf',
  keywords: ['pdf tools', 'pdf converter', 'pdf to image', 'pdf merger', 'text to pdf', 'pdf splitter', 'pdf rotate'],
})

export default function PDFTools() {
const tools = [
  {
      title: 'PDF to Image',
    description: 'Convert PDF pages to high-quality images. Support for PNG, JPEG, WebP formats and custom DPI settings.',
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
    description: 'Convert text documents to PDF format. Customize font, margins, colors, and page settings.',
    href: '/pdf/from-text',
      icon: FileText,
  },
  {
      title: 'PDF Splitter',
    description: 'Split PDF files into multiple documents. Extract pages by range or split into individual pages.',
    href: '/pdf/split',
      icon: Scissors,
  },
  {
      title: 'PDF Rotate',
    description: 'Rotate pages in PDF documents. Rotate all pages or specific pages by 90°, 180°, or 270°.',
    href: '/pdf/rotate',
      icon: RotateCw,
  },
  {
      title: 'PDF Page Delete',
    description: 'Remove specific pages from PDF documents. Delete page ranges or individual pages.',
    href: '/pdf/delete-pages',
      icon: Trash2,
  },
  {
      title: 'PDF Sign Tool',
    description: 'Sign PDF documents online. Draw your signature or upload a signature image.',
    href: '/pdf/sign',
      icon: PenTool,
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