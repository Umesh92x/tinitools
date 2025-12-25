import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PDFPageDelete } from '@/components/tools/pdf/PDFPageDelete'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Page Delete',
  description: 'Remove specific pages from PDF documents. Delete page ranges or individual pages.',
  path: '/pdf/delete-pages',
  keywords: ['pdf delete pages', 'remove pdf pages', 'pdf page remover'],
})

export default function PDFPageDeletePage() {
  return (
    <ToolLayout
      title="PDF Page Delete"
      description="Remove specific pages from PDF documents. Delete page ranges or individual pages."
    >
      <PDFPageDelete />
    </ToolLayout>
  )
}

