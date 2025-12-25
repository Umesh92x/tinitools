'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

const FAVICON_SIZES = [
  { size: 16, name: '16x16' },
  { size: 32, name: '32x32' },
  { size: 48, name: '48x48' },
  { size: 64, name: '64x64' },
  { size: 128, name: '128x128' },
  { size: 256, name: '256x256' },
]

interface GeneratedFavicon {
  size: number
  dataUrl: string
}

export function FaviconGenerator() {
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [generatedFavicons, setGeneratedFavicons] = useState<GeneratedFavicon[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const MAX_SIZE_MB = 5

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setToastMessage('Please select a valid image file')
      setToastType('error')
      setShowToast(true)
      return
    }

    const file = acceptedFiles[0]

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setToastMessage(`Please select an image smaller than ${MAX_SIZE_MB} MB`)
      setToastType('error')
      setShowToast(true)
      return
    }
    if (!file.type.startsWith('image/')) {
      setToastMessage('Please select a valid image file')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setImagePreview(dataUrl)
      setGeneratedFavicons([])
      setToastMessage('Image uploaded successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Error uploading image')
      setToastType('error')
      setShowToast(true)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false,
  })

  const generateFavicons = async () => {
    if (!imagePreview) {
      setToastMessage('Please upload an image first')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const image = new Image()
      image.src = imagePreview

      await new Promise((resolve) => {
        image.onload = resolve
      })

      const favicons = await Promise.all(selectedSizes.map(async (size) => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')

        // Draw image maintaining aspect ratio
        const scale = Math.min(size / image.width, size / image.height)
        const x = (size - image.width * scale) / 2
        const y = (size - image.height * scale) / 2
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale)

        return {
          size,
          dataUrl: canvas.toDataURL('image/png'),
        }
      }))

      setGeneratedFavicons(favicons)
      setToastMessage('Favicons generated successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Error generating favicons')
      setToastType('error')
      setShowToast(true)
    }
  }

  const downloadFavicon = (dataUrl: string, size: number) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `favicon-${size}x${size}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllFavicons = () => {
    generatedFavicons.forEach(({ dataUrl, size }) => {
      downloadFavicon(dataUrl, size)
    })
  }

  const handleCopyHtmlLinks = async () => {
    if (!generatedFavicons.length) {
      setToastMessage('Generate favicons first to get HTML link tags')
      setToastType('error')
      setShowToast(true)
      return
    }

    const snippet = generatedFavicons
      .map(({ size }) => `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`)
      .join('\n')

    try {
      await navigator.clipboard.writeText(snippet)
      setToastMessage('HTML <link> tags copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Failed to copy HTML <link> tags')
      setToastType('error')
      setShowToast(true)
    }
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-gray-600">
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag and drop an image here, or click to select</p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Recommended: square image with transparent background (PNG), up to {MAX_SIZE_MB} MB
          </p>
        </div>
      </div>

      {imagePreview && (
        <>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 max-w-full"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Sizes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {FAVICON_SIZES.map(({ size, name }) => (
                <label
                  key={size}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSizes([...selectedSizes, size])
                      } else {
                        setSelectedSizes(selectedSizes.filter(s => s !== size))
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">{name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={generateFavicons}
            disabled={selectedSizes.length === 0}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Generate Favicons
          </button>
        </>
      )}

      {generatedFavicons.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Generated Favicons</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyHtmlLinks}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Copy HTML &lt;link&gt; tags
              </button>
            <button
              onClick={downloadAllFavicons}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Download All
            </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {generatedFavicons.map(({ size, dataUrl }) => (
              <div
                key={size}
                className="bg-white p-4 rounded-lg shadow-sm space-y-2"
              >
                <div className="flex items-center justify-center bg-gray-50 p-2 rounded">
                  <img
                    src={dataUrl}
                    alt={`${size}x${size}`}
                    className="max-w-full"
                    style={{ width: size, height: size }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{size}x{size}</span>
                  <button
                    onClick={() => downloadFavicon(dataUrl, size)}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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