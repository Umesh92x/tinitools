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
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
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
  }

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
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
    if (!selectedFile || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = newDimensions.width
      canvas.height = newDimensions.height
      ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height)
      
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
          setShowToast(true)
        }
      }, selectedFile.type)
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
        type="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 