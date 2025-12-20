import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { Merge } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = generateMetadata({
  title: 'PDF Merger',
  description: 'Combine multiple PDF files into a single document. Arrange pages and set custom order.',
  path: '/pdf/merge',
  keywords: ['pdf merger', 'combine pdf', 'merge pdf files', 'pdf combiner'],
})

export default function PDFMerger() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <Merge className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            PDF Merger
          </h1>
          <p className="text-lg text-gray-600">
            Combine multiple PDF files into a single document. Arrange pages and set custom order.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form className="space-y-6">
            <div>
              <Label htmlFor="pdfFiles">Select PDF Files</Label>
              <Input 
                id="pdfFiles" 
                type="file" 
                accept=".pdf"
                multiple
                className="mt-1" 
              />
              <p className="mt-2 text-sm text-gray-500">
                You can select multiple PDF files to merge
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Selected Files</h3>
              <div className="text-sm text-gray-500">
                No files selected
              </div>
            </div>

            <Button type="submit" className="w-full">
              Merge PDFs
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 