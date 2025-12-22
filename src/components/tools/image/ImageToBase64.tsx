'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface PreviewImage {
  file: File
  preview: string
  base64: string
}

export function ImageToBase64() {
  const [image, setImage] = useState<PreviewImage | null>(null)
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
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setImage({
        file,
        preview: URL.createObjectURL(file),
        base64,
      })

      setToastMessage('Image converted successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Error converting image')
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

  const handleCopy = async () => {
    if (!image?.base64) return

    try {
      await navigator.clipboard.writeText(image.base64)
      setToastMessage('Base64 string copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Failed to copy to clipboard')
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleCopyImgTag = async () => {
    if (!image?.base64) return

    const imgTag = `<img src="${image.base64}" alt="${image.file.name}" />`
    try {
      await navigator.clipboard.writeText(imgTag)
      setToastMessage('<img> tag with Base64 source copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Failed to copy <img> tag to clipboard')
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleDownloadText = () => {
    if (!image?.base64) return

    const blob = new Blob([image.base64], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${image.file.name}-base64.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (image) {
      URL.revokeObjectURL(image.preview)
      setImage(null)
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
            Supports PNG, JPG, GIF, and WebP (up to {MAX_SIZE_MB} MB)
          </p>
        </div>
      </div>

      {image && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900">Preview</h3>
              <div className="mt-2">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="max-h-48 max-w-full mx-auto"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>File name:</span>
                <span>{image.file.name}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>File size:</span>
                <span>{(image.file.size / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>File type:</span>
                <span>{image.file.type}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base64 Output
            </label>
            <textarea
              rows={6}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
              value={image.base64}
              readOnly
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Copy Base64
            </button>
            <button
              onClick={handleCopyImgTag}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Copy &lt;img&gt; Tag
            </button>
            <button
              onClick={handleDownloadText}
              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Download as .txt
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
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