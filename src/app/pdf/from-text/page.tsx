import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const metadata: Metadata = generateMetadata({
  title: 'Text to PDF',
  description: 'Convert text documents to PDF format. Customize font, margins, and page settings.',
  path: '/pdf/from-text',
  keywords: ['text to pdf', 'convert text', 'create pdf', 'pdf creator'],
})

export default function TextToPDF() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Text to PDF
          </h1>
          <p className="text-lg text-gray-600">
            Convert text documents to PDF format. Customize font, margins, and page settings.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form className="space-y-6">
            <div>
              <Label>Enter Text</Label>
              <Textarea 
                placeholder="Type or paste your text here..."
                className="mt-1 h-48"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Font Family</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Font Size</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10pt</SelectItem>
                    <SelectItem value="12">12pt</SelectItem>
                    <SelectItem value="14">14pt</SelectItem>
                    <SelectItem value="16">16pt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Page Size</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Margins</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select margins" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="narrow">Narrow</SelectItem>
                    <SelectItem value="wide">Wide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Convert to PDF
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 