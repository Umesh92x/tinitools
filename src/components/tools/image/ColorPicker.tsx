'use client'

import { useState, useRef, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Color {
  hex: string
  rgb: string
  hsl: string
}

interface SavedColor extends Color {
  id: string
  name: string
}

export function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState<Color>({
    hex: '#000000',
    rgb: 'rgb(0, 0, 0)',
    hsl: 'hsl(0, 0%, 0%)',
  })
  const [savedColors, setSavedColors] = useState<SavedColor[]>([])
  const [colorName, setColorName] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    const rgb = `rgb(${r}, ${g}, ${b})`
    const hsl = rgbToHsl(r, g, b)

    setSelectedColor({ hex, rgb, hsl })
  }

  const handleSaveColor = () => {
    if (!colorName.trim()) {
      setToastMessage('Please enter a color name')
      setToastType('error')
      setShowToast(true)
      return
    }

    const newColor: SavedColor = {
      id: Date.now().toString(),
      name: colorName,
      ...selectedColor,
    }

    setSavedColors(prev => [...prev, newColor])
    setColorName('')
    setToastMessage('Color saved!')
    setToastType('success')
    setShowToast(true)
  }

  const handleDeleteColor = (id: string) => {
    setSavedColors(prev => prev.filter(color => color.id !== id))
  }

  const handleCopyColor = (value: string) => {
    navigator.clipboard.writeText(value)
      .then(() => {
        setToastMessage('Color code copied!')
        setToastType('success')
        setShowToast(true)
      })
      .catch(() => {
        setToastMessage('Failed to copy color code')
        setToastType('error')
        setShowToast(true)
      })
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    if (!file.type.startsWith('image/')) {
      setToastMessage('Please select a valid image file')
      setToastType('error')
      setShowToast(true)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImagePreview(dataUrl)

      // Create image and canvas for color picking
      const img = new Image()
      img.src = dataUrl
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(img, 0, 0)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
  })

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const r = pixel[0]
    const g = pixel[1]
    const b = pixel[2]
    const hex = rgbToHex(r, g, b)
    const rgb = `rgb(${r}, ${g}, ${b})`
    const hsl = rgbToHsl(r, g, b)

    setSelectedColor({ hex, rgb, hsl })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Wheel
            </label>
            <input
              type="color"
              value={selectedColor.hex}
              onChange={handleColorChange}
              className="w-full h-40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Codes
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">HEX:</span>
                <button
                  onClick={() => handleCopyColor(selectedColor.hex)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {selectedColor.hex}
                </button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">RGB:</span>
                <button
                  onClick={() => handleCopyColor(selectedColor.rgb)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {selectedColor.rgb}
                </button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-600">HSL:</span>
                <button
                  onClick={() => handleCopyColor(selectedColor.hsl)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {selectedColor.hsl}
                </button>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Enter color name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={handleSaveColor}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-4">
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
                Click anywhere on the image to pick a color
              </p>
            </div>
          </div>

          {imagePreview && (
            <div className="relative">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full cursor-crosshair"
              />
            </div>
          )}
        </div>
      </div>

      {savedColors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedColors.map(color => (
              <div
                key={color.id}
                className="bg-white p-4 rounded-lg shadow-sm space-y-2"
              >
                <div
                  className="w-full h-12 rounded"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {color.name}
                  </span>
                  <button
                    onClick={() => handleDeleteColor(color.id)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() => handleCopyColor(color.hex)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 block w-full text-left"
                >
                  {color.hex}
                </button>
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