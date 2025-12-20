'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'

interface ConversionOptions {
  format: 'png' | 'jpeg'
  quality: number
  dpi: number
}

export function PDFToImage() {
  const [file, setFile] = useState<File | null>(null)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [options, setOptions] = useState<ConversionOptions>({
    format: 'png',
    quality: 90,
    dpi: 300,
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0]
    if (pdfFile?.type !== 'application/pdf') {
      setToastMessage('Please upload a PDF file')
      setToastType('error')
      setShowToast(true)
      return
    }
    setFile(pdfFile)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const convertToImage = async () => {
    if (!file) return

    try {
      setConverting(true)
      setProgress(0)

      // Load the PDF document
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await getDocument(arrayBuffer).promise
      const totalPages = pdf.numPages

      // Create a zip file to store all images
      const zip = new JSZip()

      // Convert each page
      for (let i = 1; i <= totalPages; i++) {
        // Get the page
        const page = await pdf.getPage(i)

        // Calculate dimensions based on DPI
        const scale = options.dpi / 72.0
        const viewport = page.getViewport({ scale })

        // Create a canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Could not get canvas context')

        canvas.width = viewport.width
        canvas.height = viewport.height

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport,
        }).promise

        // Convert canvas to image blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob!),
            `image/${options.format}`,
            options.quality / 100
          )
        })

        // Add to zip
        zip.file(`page-${i}.${options.format}`, blob)

        // Update progress
        setProgress((i / totalPages) * 100)
      }

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.name.replace('.pdf', '')}-images.zip`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setToastMessage('Conversion completed successfully!')
      setToastType('success')
    } catch (error) {
      console.error('Conversion error:', error)
      setToastMessage('Error converting PDF to images')
      setToastType('error')
    } finally {
      setConverting(false)
      setProgress(0)
      setShowToast(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm text-gray-600">
                {file ? (
                  <p>{file.name}</p>
                ) : (
                  <p>
                    Drag & drop a PDF file here, or{' '}
                    <span className="text-indigo-600">browse</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Output Format
              </label>
              <select
                value={options.format}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    format: e.target.value as 'png' | 'jpeg',
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quality ({options.quality}%)
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={options.quality}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    quality: parseInt(e.target.value),
                  }))
                }
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                DPI ({options.dpi})
              </label>
              <input
                type="range"
                min="72"
                max="600"
                step="72"
                value={options.dpi}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    dpi: parseInt(e.target.value),
                  }))
                }
                className="mt-1 block w-full"
              />
            </div>
          </div>

          <button
            onClick={convertToImage}
            disabled={!file || converting}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {converting ? 'Converting...' : 'Convert to Images'}
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">1. Upload PDF</h4>
              <p className="text-sm text-gray-600">
                Drag and drop your PDF file or click to browse. Maximum file size: 100MB.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">2. Choose Settings</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Format: Choose between PNG (better quality) or JPEG (smaller size)</li>
                <li>• Quality: Adjust image quality (higher = better quality but larger file size)</li>
                <li>• DPI: Set resolution (higher = sharper images but larger file size)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">3. Convert</h4>
              <p className="text-sm text-gray-600">
                Click "Convert to Images" and wait for the process to complete. Images will be
                downloaded as a ZIP file.
              </p>
            </div>
          </div>

          {converting && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Converting...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 