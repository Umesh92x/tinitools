'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'

interface ConversionOptions {
  format: 'png' | 'jpeg' | 'webp'
  quality: number
  dpi: number
}

export function PDFToImage() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
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
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadFilename, setDownloadFilename] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pdfjs, setPdfjs] = useState<any>(null)

  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    // Dynamically load PDF.js only on client side
    if (typeof window !== 'undefined' && !pdfjs) {
      // Use dynamic import to avoid SSR issues
      import('pdfjs-dist').then((pdfjsModule) => {
        // Set PDF.js worker path
        pdfjsModule.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
        
        // Test if worker loads
        fetch('/pdf.worker.min.js', { method: 'HEAD' })
          .then(() => {
            // Worker file found locally
          })
          .catch(() => {
            // Local worker not found, use CDN fallback
            const pdfjsVersion = '3.11.174'
            pdfjsModule.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`
          })
        
        setPdfjs(pdfjsModule)
      }).catch((err) => {
        console.error('Failed to load PDF.js:', err)
        setError('Failed to load PDF processing library. Please refresh the page.')
      })
    }
  }, [pdfjs])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null)
    const pdfFile = acceptedFiles[0]
    
    if (!pdfFile) {
      setError('No file selected.')
      return
    }

    if (pdfFile.type !== 'application/pdf') {
      setError('Please upload a PDF file. Other file types are not supported.')
      showMessage('Please upload a PDF file', 'error')
      return
    }

    if (pdfFile.size > MAX_FILE_SIZE) {
      const fileSizeMB = (pdfFile.size / (1024 * 1024)).toFixed(2)
      setError(`File size (${fileSizeMB} MB) exceeds the maximum limit of 100 MB.`)
      showMessage(`File too large: ${fileSizeMB} MB (max 100 MB)`, 'error')
      return
    }

    setFile(pdfFile)
    
    // Try to get page count (optional - don't block if it fails)
    if (!pdfjs) {
      // PDF.js not loaded yet, skip page count
      return
    }
    
    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjs.getDocument(arrayBuffer).promise
      setPageCount(pdf.numPages)
      showMessage(`PDF loaded: ${pdf.numPages} page${pdf.numPages !== 1 ? 's' : ''}`)
    } catch (err) {
      console.error('Error reading PDF for page count:', err)
      // Don't block conversion - just set pageCount to null
      setPageCount(null)
      // Only show error if it's a critical issue
      if (err instanceof Error && err.message.includes('password')) {
        setError('PDF is password-protected. Please remove the password and try again.')
        showMessage('PDF is password-protected', 'error')
      }
    }
  }, [pdfjs])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const convertToImage = async () => {
    if (!file) {
      const errorMsg = 'Please upload a PDF file first.'
      setError(errorMsg)
      showMessage(errorMsg, 'error')
      return
    }

    if (!pdfjs) {
      const errorMsg = 'PDF processing library is still loading. Please wait a moment and try again.'
      setError(errorMsg)
      showMessage(errorMsg, 'error')
      return
    }

    try {
      console.log('Starting conversion process...')
      setConverting(true)
      setProgress(0)
      setError(null)
      setDownloadUrl(null)
      setStatus('Loading PDF file...')

      console.log('Conversion options:', { format: options.format, dpi: options.dpi, quality: options.quality })

      // Load the PDF document
      console.log('Loading PDF file...')
      const arrayBuffer = await file.arrayBuffer()
      console.log('PDF loaded, arrayBuffer size:', arrayBuffer.byteLength)
      setStatus('Reading PDF pages...')
      
      console.log('Initializing PDF.js document...')
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      const totalPages = pdf.numPages
      console.log('PDF has', totalPages, 'pages')
      
      if (totalPages === 0) {
        throw new Error('PDF has no pages to convert.')
      }
      
      setStatus(`Converting ${totalPages} page${totalPages !== 1 ? 's' : ''} to images...`)

      if (totalPages === 0) {
        throw new Error('PDF has no pages to convert.')
      }

      // Create a zip file to store all images
      const zip = new JSZip()

      // Convert each page
      for (let i = 1; i <= totalPages; i++) {
        console.log(`Converting page ${i} of ${totalPages}...`)
        
        // Get the page
        const page = await pdf.getPage(i)

        // Calculate dimensions based on DPI
        const scale = options.dpi / 72.0
        const viewport = page.getViewport({ scale })

        // Create a canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) {
          throw new Error('Could not get canvas context. Your browser may not support canvas operations.')
        }

        canvas.width = viewport.width
        canvas.height = viewport.height

        console.log(`Rendering page ${i} at ${canvas.width}x${canvas.height} pixels...`)

        // Render PDF page to canvas
        await page.render({
          canvasContext: context,
          viewport,
        }).promise

        console.log(`Page ${i} rendered, converting to ${options.format}...`)

        // Convert canvas to image blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          let mimeType: string
          let quality: number | undefined
          
          switch (options.format) {
            case 'png':
              mimeType = 'image/png'
              break
            case 'jpeg':
              mimeType = 'image/jpeg'
              quality = options.quality / 100
              break
            case 'webp':
              mimeType = 'image/webp'
              quality = options.quality / 100
              break
            default:
              mimeType = 'image/png'
          }
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log(`Page ${i} converted, blob size:`, blob.size)
                resolve(blob)
              } else {
                reject(new Error(`Failed to convert page ${i} canvas to blob`))
              }
            },
            mimeType,
            quality
          )
        })

        // Add to zip
        zip.file(`page-${i}.${options.format}`, blob)

        // Update progress
        setProgress((i / totalPages) * 100)
      }

      console.log('All pages converted, generating ZIP file...')

      // Generate and download zip
      console.log('Generating ZIP file...')
      setStatus('Generating ZIP file...')
      const content = await zip.generateAsync({ type: 'blob' })
      console.log('ZIP file generated, size:', content.size)
      
      const filename = `${file.name.replace('.pdf', '')}-images.zip`
      const url = URL.createObjectURL(content)
      
      // Store download URL for manual download button
      setDownloadUrl(url)
      setDownloadFilename(filename)
      
      // Try automatic download
      try {
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        
        // Clean up after a delay
        setTimeout(() => {
          document.body.removeChild(a)
        }, 1000)
        
        console.log('Automatic download triggered')
        setStatus('Conversion complete! Download started automatically.')
      } catch (downloadError) {
        console.error('Automatic download failed:', downloadError)
        setStatus('Conversion complete! Use the download button below to save your file.')
      }

      showMessage(`Successfully converted ${totalPages} page${totalPages !== 1 ? 's' : ''} to images!`)
    } catch (error) {
      console.error('Conversion error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error converting PDF to images'
      console.error('Error details:', {
        message: errorMessage,
        error,
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      setError(errorMessage)
      setStatus(`Error: ${errorMessage}`)
      setDownloadUrl(null)
      showMessage(errorMessage, 'error')
      
    } finally {
      setConverting(false)
      setProgress(0)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPageCount(null)
    setProgress(0)
    setError(null)
    setDownloadUrl(null)
    setDownloadFilename('')
    setStatus('')
    setOptions({
      format: 'png',
      quality: 90,
      dpi: 300,
    })
  }

  const handleManualDownload = () => {
    if (!downloadUrl) return
    
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = downloadFilename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    showMessage('Download started!')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
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
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                      {pageCount !== null && ` • ${pageCount} page${pageCount !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                ) : (
                  <p>
                    Drag & drop a PDF file here, or{' '}
                    <span className="text-indigo-600">browse</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {!pdfjs && typeof window !== 'undefined' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-600">Loading PDF processing library...</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {file && (
            <button
              onClick={() => {
                setFile(null)
                setPageCount(null)
                setError(null)
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              Remove file
            </button>
          )}

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
                    format: e.target.value as 'png' | 'jpeg' | 'webp',
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="png">PNG (Lossless, preserves transparency)</option>
                <option value="jpeg">JPEG (Smaller size, good quality)</option>
                <option value="webp">WebP (Modern format, best compression)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                PNG: Lossless with transparency. JPEG: Smaller files, good for photos. WebP: Modern format with excellent compression.
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                Higher quality = better image but larger file size. Recommended: 80-95% for JPEG/WebP.
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                Higher DPI = sharper images but much larger files. 72 DPI for web, 300 DPI for print.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                convertToImage()
              }}
              disabled={!file || converting || !pdfjs}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!pdfjs ? 'Loading PDF library...' : converting ? `Converting... ${Math.round(progress)}%` : 'Convert to Images'}
            </button>
            <button
              onClick={handleReset}
              disabled={converting}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
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

          {(converting || status) && (
            <div className="mt-6 space-y-3">
              {status && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">{status}</p>
                </div>
              )}
              {converting && (
                <div>
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
          )}

          {downloadUrl && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm font-medium text-green-800 mb-2">
                ✓ Conversion Complete!
              </p>
              <p className="text-sm text-green-700 mb-3">
                Your images have been converted. If the download didn't start automatically, click the button below.
              </p>
              <button
                onClick={handleManualDownload}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download ZIP File
              </button>
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