import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const metadata: Metadata = generateMetadata({
  title: 'PDF to Image Converter',
  description: 'Convert PDF pages to high-quality images. Support for PNG, JPEG formats and custom DPI settings.',
  path: '/pdf/to-image',
  keywords: ['pdf to image', 'pdf converter', 'pdf to png', 'pdf to jpg'],
})

export default function PDFToImage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <FileImage className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            PDF to Image Converter
          </h1>
          <p className="text-lg text-gray-600">
            Convert PDF pages to high-quality images. Support for PNG, JPEG formats and custom DPI settings.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <form className="space-y-6">
            <div>
              <Label htmlFor="pdfFile">Select PDF File</Label>
              <Input 
                id="pdfFile" 
                type="file" 
                accept=".pdf"
                className="mt-1" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Image Format</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>DPI Quality</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select DPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="72">72 DPI</SelectItem>
                    <SelectItem value="150">150 DPI</SelectItem>
                    <SelectItem value="300">300 DPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Convert to Image
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 