'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface ImageDimensions {
  width: number
  height: number
}

export function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 0, height: 0 })
  const [newDimensions, setNewDimensions] = useState<ImageDimensions>({ width: 0, height: 0 })
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [quality, setQuality] = useState(80) // percentage, used for JPEG/WebP
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setToastMessage('Please select a valid image file.')
      setToastType('error')
      setShowToast(true)
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height })
        setNewDimensions({ width: img.width, height: img.height })
        setPreview(e.target?.result as string)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (!value || value <= 0) {
      // Ignore invalid or non-positive values; user will be warned on resize
      setNewDimensions((prev) => ({
        ...prev,
        [dimension]: 0,
      }))
      return
    }

    if (maintainAspectRatio) {
      const aspectRatio = dimensions.width / dimensions.height
      if (dimension === 'width') {
        setNewDimensions({
          width: value,
          height: Math.round(value / aspectRatio),
        })
      } else {
        setNewDimensions({
          width: Math.round(value * aspectRatio),
          height: value,
        })
      }
    } else {
      setNewDimensions({
        ...newDimensions,
        [dimension]: value,
      })
    }
  }

  const resizeImage = () => {
    if (!selectedFile || !canvasRef.current) {
      setToastMessage('Please upload an image first.')
      setToastType('error')
      setShowToast(true)
      return
    }

    if (newDimensions.width <= 0 || newDimensions.height <= 0) {
      setToastMessage('Please enter valid width and height greater than 0.')
      setToastType('error')
      setShowToast(true)
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = newDimensions.width
      canvas.height = newDimensions.height
      ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height)

      const originalType = selectedFile.type
      const mimeType =
        originalType === 'image/jpeg' ||
        originalType === 'image/jpg' ||
        originalType === 'image/webp'
          ? originalType
          : 'image/png'
      const qualityFactor =
        mimeType === 'image/jpeg' || mimeType === 'image/webp'
          ? quality / 100
          : undefined

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `resized-${selectedFile.name}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          setToastMessage('Image resized and downloaded successfully!')
          setToastType('success')
          setShowToast(true)
        }
      }, mimeType, qualityFactor)
    }
    img.src = preview
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="mb-4"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto mb-4"
            style={{ maxHeight: '300px' }}
          />
        )}
      </div>

      {selectedFile && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Width</label>
              <input
                type="number"
                value={newDimensions.width}
                onChange={(e) => handleDimensionChange('width', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height</label>
              <input
                type="number"
                value={newDimensions.height}
                onChange={(e) => handleDimensionChange('height', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="aspectRatio"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="aspectRatio" className="ml-2 block text-sm text-gray-900">
              Maintain aspect ratio
            </label>
          </div>

          <div className="mt-4 space-y-1">
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700">
              Output quality (for JPEG/WebP)
            </label>
            <input
              id="quality"
              type="range"
              min={30}
              max={100}
              step={5}
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Smaller file</span>
              <span>{quality}% quality</span>
              <span>Better quality</span>
            </div>
            <p className="text-xs text-gray-400">
              Quality slider affects JPEG/WebP downloads. PNG images are always exported at full quality.
            </p>
          </div>

          <button
            onClick={resizeImage}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Resize & Download
          </button>

          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
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