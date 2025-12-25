'use client'

import { useState, useRef } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface PageSettings {
  pageSize: 'A4' | 'Letter' | 'Legal'
  orientation: 'portrait' | 'landscape'
  fontSize: number
  lineHeight: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  font: StandardFonts
  textColor: string
  textAlign: 'left' | 'center' | 'right' | 'justify'
}

const defaultSettings: PageSettings = {
  pageSize: 'A4',
  orientation: 'portrait',
  fontSize: 12,
  lineHeight: 1.5,
  marginTop: 72, // 1 inch = 72 points
  marginRight: 72,
  marginBottom: 72,
  marginLeft: 72,
  font: StandardFonts.Helvetica,
  textColor: '#000000',
  textAlign: 'left',
}

const pageSizes = {
  A4: { width: 595.28, height: 841.89 }, // A4 in points
  Letter: { width: 612, height: 792 }, // US Letter in points
  Legal: { width: 612, height: 1008 }, // Legal in points
}

const marginPresets = {
  narrow: { top: 36, right: 36, bottom: 36, left: 36 }, // 0.5 inch
  normal: { top: 72, right: 72, bottom: 72, left: 72 }, // 1 inch
  wide: { top: 108, right: 108, bottom: 108, left: 108 }, // 1.5 inch
}

const fontOptions = [
  { value: StandardFonts.Helvetica, label: 'Helvetica' },
  { value: StandardFonts.HelveticaBold, label: 'Helvetica Bold' },
  { value: StandardFonts.TimesRoman, label: 'Times Roman' },
  { value: StandardFonts.TimesRomanBold, label: 'Times Roman Bold' },
  { value: StandardFonts.Courier, label: 'Courier' },
  { value: StandardFonts.CourierBold, label: 'Courier Bold' },
]

export function TextToPDF() {
  const [text, setText] = useState('')
  const [settings, setSettings] = useState<PageSettings>(defaultSettings)
  const [filename, setFilename] = useState('document')
  const [converting, setConverting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const updateSetting = <K extends keyof PageSettings>(
    key: K,
    value: PageSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const convertToPDF = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert to PDF.')
      showMessage('Please enter some text to convert', 'error')
      return
    }

    if (text.length > 100000) {
      setError('Text is too long. Maximum 100,000 characters allowed.')
      showMessage('Text is too long (max 100,000 characters)', 'error')
      return
    }

    try {
      setConverting(true)
      setError(null)
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(settings.font)
      const textColorRgb = hexToRgb(settings.textColor)

      // Get page dimensions based on orientation
      const basePageSize = pageSizes[settings.pageSize]
      const pageWidth = settings.orientation === 'landscape' ? basePageSize.height : basePageSize.width
      const pageHeight = settings.orientation === 'landscape' ? basePageSize.width : basePageSize.height
      
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight])

      let yPosition = pageHeight - settings.marginTop
      const lineHeight = settings.fontSize * settings.lineHeight
      const maxWidth = pageWidth - settings.marginLeft - settings.marginRight

      const getTextX = (lineWidth: number) => {
        switch (settings.textAlign) {
          case 'center':
            return settings.marginLeft + (maxWidth - lineWidth) / 2
          case 'right':
            return settings.marginLeft + (maxWidth - lineWidth)
          case 'justify':
          case 'left':
          default:
            return settings.marginLeft
        }
      }

      const writeLine = (lineText: string) => {
        if (!lineText.trim()) {
          // Empty line - just move down
          yPosition -= lineHeight
          if (yPosition < settings.marginBottom) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight])
            yPosition = pageHeight - settings.marginTop
          }
          return
        }

        const lineWidth = font.widthOfTextAtSize(lineText, settings.fontSize)
        
        // If line fits, write it as-is
        if (lineWidth <= maxWidth) {
          currentPage.drawText(lineText, {
            x: getTextX(lineWidth),
            y: yPosition,
            size: settings.fontSize,
            font,
            color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
          })
          yPosition -= lineHeight
        } else {
          // Line is too long, wrap it by words
          const words = lineText.split(/\s+/)
          let currentLine = ''

          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const testWidth = font.widthOfTextAtSize(testLine, settings.fontSize)

            if (testWidth > maxWidth) {
              // Write current line
              if (currentLine) {
                const currentLineWidth = font.widthOfTextAtSize(currentLine, settings.fontSize)
                currentPage.drawText(currentLine, {
                  x: getTextX(currentLineWidth),
                  y: yPosition,
                  size: settings.fontSize,
                  font,
                  color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
                })
                yPosition -= lineHeight

                // Check if we need a new page
                if (yPosition < settings.marginBottom) {
                  currentPage = pdfDoc.addPage([pageWidth, pageHeight])
                  yPosition = pageHeight - settings.marginTop
                }
              }
              currentLine = word
            } else {
              currentLine = testLine
            }
          }

          // Write remaining line
          if (currentLine) {
            const currentLineWidth = font.widthOfTextAtSize(currentLine, settings.fontSize)
            currentPage.drawText(currentLine, {
              x: getTextX(currentLineWidth),
              y: yPosition,
              size: settings.fontSize,
              font,
              color: rgb(textColorRgb.r, textColorRgb.g, textColorRgb.b),
            })
            yPosition -= lineHeight
          }
        }

        // Check if we need a new page
        if (yPosition < settings.marginBottom) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight])
          yPosition = pageHeight - settings.marginTop
        }
      }

      // Split text by line breaks to preserve original line structure
      // Handle both single (\n) and double (\n\n) line breaks
      const lines = text.split(/\n/)
      let previousLineWasEmpty = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const isCurrentLineEmpty = !line.trim()
        
        // If we have a double line break (empty line after empty line), add extra spacing
        if (isCurrentLineEmpty && previousLineWasEmpty) {
          yPosition -= lineHeight
          if (yPosition < settings.marginBottom) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight])
            yPosition = pageHeight - settings.marginTop
          }
        }

        writeLine(line)
        previousLineWasEmpty = isCurrentLineEmpty
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename || 'document'}.pdf`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      const pageCount = pdfDoc.getPageCount()
      showMessage(`PDF created successfully with ${pageCount} page${pageCount !== 1 ? 's' : ''}!`)
    } catch (error) {
      console.error('Conversion error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error converting text to PDF'
      setError(errorMessage)
      showMessage(errorMessage, 'error')
    } finally {
      setConverting(false)
    }
  }

  const handleReset = () => {
    setText('')
    setSettings(defaultSettings)
    setError(null)
  }

  const getCharacterCount = () => {
    return text.length
  }

  const getWordCount = () => {
    return text.trim() ? text.trim().split(/\s+/).length : 0
  }

  const getParagraphCount = () => {
    return text.trim() ? text.trim().split(/\n\n+/).filter(p => p.trim()).length : 0
  }

  const getSentenceCount = () => {
    if (!text.trim()) return 0
    const sentences = text.match(/[.!?]+/g)
    return sentences ? sentences.length : 1
  }

  const getReadingTime = () => {
    const words = getWordCount()
    const readingSpeed = 200 // words per minute
    const minutes = Math.ceil(words / readingSpeed)
    return minutes
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 }
  }

  const applyMarginPreset = (preset: 'narrow' | 'normal' | 'wide') => {
    const margins = marginPresets[preset]
    setSettings((prev) => ({
      ...prev,
      marginTop: margins.top,
      marginRight: margins.right,
      marginBottom: margins.bottom,
      marginLeft: margins.left,
    }))
  }

  const handleFileImport = async (files: File[]) => {
    const file = files[0]
    if (!file) return

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a .txt file')
      showMessage('Please upload a .txt file', 'error')
      return
    }

    try {
      const fileContent = await file.text()
      setText(fileContent)
      setFilename(file.name.replace('.txt', ''))
      showMessage('Text file imported successfully!')
    } catch (err) {
      setError('Failed to read file')
      showMessage('Failed to read file', 'error')
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileImport([file])
    }
  }

  // Add this function to calculate preview dimensions
  const getPreviewDimensions = () => {
    const basePageSize = pageSizes[settings.pageSize]
    const pageWidth = settings.orientation === 'landscape' ? basePageSize.height : basePageSize.width
    const pageHeight = settings.orientation === 'landscape' ? basePageSize.width : basePageSize.height
    const scale = 0.4 // Scale factor to fit the preview
    return {
      width: pageWidth * scale,
      height: pageHeight * scale,
      scale,
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative bg-white shadow-lg rounded-lg">
            {/* Page size preview container */}
            <div
              className="relative mx-auto bg-white"
              style={{
                width: `${getPreviewDimensions().width}px`,
                height: `${getPreviewDimensions().height}px`,
                border: '1px solid #e5e7eb',
              }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter or paste your text here..."
                className="absolute inset-0 w-full h-full resize-none border-0 focus:ring-0 focus:border-0"
                style={{
                  fontFamily: settings.font === StandardFonts.Courier || settings.font === StandardFonts.CourierBold
                    ? 'Courier'
                    : settings.font === StandardFonts.TimesRoman || settings.font === StandardFonts.TimesRomanBold
                    ? 'Times New Roman'
                    : 'Helvetica, Arial',
                  fontWeight: settings.font.includes('Bold') ? 'bold' : 'normal',
                  fontSize: `${settings.fontSize * getPreviewDimensions().scale}px`,
                  lineHeight: settings.lineHeight,
                  padding: `${settings.marginTop * getPreviewDimensions().scale}px ${
                    settings.marginRight * getPreviewDimensions().scale
                  }px ${settings.marginBottom * getPreviewDimensions().scale}px ${
                    settings.marginLeft * getPreviewDimensions().scale
                  }px`,
                }}
              />
              <div className="absolute top-0 right-0 p-2 text-xs text-gray-500 bg-white rounded-bl-lg border-l border-b">
                Preview: {settings.pageSize}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Text Import */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
                >
                  📄 Import from .txt file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Filename Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  PDF Filename
                </label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  placeholder="document"
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Statistics */}
              {text && (
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium">{getCharacterCount()}</span> characters
                  </div>
                  <div>
                    <span className="font-medium">{getWordCount()}</span> words
                  </div>
                  <div>
                    <span className="font-medium">{getParagraphCount()}</span> paragraphs
                  </div>
                  <div>
                    <span className="font-medium">{getSentenceCount()}</span> sentences
                  </div>
                  <div className="col-span-2 text-center pt-1 border-t border-gray-200">
                    <span className="font-medium">{getReadingTime()}</span> min reading time
                  </div>
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={convertToPDF}
                  disabled={!text.trim() || converting}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {converting ? 'Converting...' : 'Convert to PDF'}
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
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Page Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Page Size
                </label>
                <select
                  value={settings.pageSize}
                  onChange={(e) =>
                    updateSetting('pageSize', e.target.value as PageSettings['pageSize'])
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">US Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Orientation
                </label>
                <select
                  value={settings.orientation}
                  onChange={(e) =>
                    updateSetting('orientation', e.target.value as 'portrait' | 'landscape')
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margin Presets
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => applyMarginPreset('narrow')}
                  className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Narrow (0.5")
                </button>
                <button
                  onClick={() => applyMarginPreset('normal')}
                  className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Normal (1")
                </button>
                <button
                  onClick={() => applyMarginPreset('wide')}
                  className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Wide (1.5")
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Font
              </label>
              <select
                value={settings.font}
                onChange={(e) =>
                  updateSetting('font', e.target.value as StandardFonts)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {fontOptions.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Font Size ({settings.fontSize}pt)
              </label>
              <input
                type="range"
                min="8"
                max="72"
                value={settings.fontSize}
                onChange={(e) =>
                  updateSetting('fontSize', parseInt(e.target.value))
                }
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Line Height ({settings.lineHeight})
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) =>
                  updateSetting('lineHeight', parseFloat(e.target.value))
                }
                className="mt-1 block w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Text Alignment
                </label>
                <select
                  value={settings.textAlign}
                  onChange={(e) =>
                    updateSetting('textAlign', e.target.value as PageSettings['textAlign'])
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Text Color
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => updateSetting('textColor', e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.textColor}
                    onChange={(e) => {
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        updateSetting('textColor', e.target.value)
                      }
                    }}
                    className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Top Margin ({(settings.marginTop / 72).toFixed(1)}in)
                </label>
                <input
                  type="range"
                  min="36"
                  max="144"
                  value={settings.marginTop}
                  onChange={(e) =>
                    updateSetting('marginTop', parseInt(e.target.value))
                  }
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Right Margin ({(settings.marginRight / 72).toFixed(1)}in)
                </label>
                <input
                  type="range"
                  min="36"
                  max="144"
                  value={settings.marginRight}
                  onChange={(e) =>
                    updateSetting('marginRight', parseInt(e.target.value))
                  }
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bottom Margin ({(settings.marginBottom / 72).toFixed(1)}in)
                </label>
                <input
                  type="range"
                  min="36"
                  max="144"
                  value={settings.marginBottom}
                  onChange={(e) =>
                    updateSetting('marginBottom', parseInt(e.target.value))
                  }
                  className="mt-1 block w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Left Margin ({(settings.marginLeft / 72).toFixed(1)}in)
                </label>
                <input
                  type="range"
                  min="36"
                  max="144"
                  value={settings.marginLeft}
                  onChange={(e) =>
                    updateSetting('marginLeft', parseInt(e.target.value))
                  }
                  className="mt-1 block w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Enter Text</h4>
                <p className="text-sm text-gray-600">
                  Type or paste your text in the editor. Double line breaks will create new paragraphs.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Customize Settings</h4>
                <p className="text-sm text-gray-600">
                  The preview shows exactly how your PDF will look. Try different page sizes and fonts!
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Convert</h4>
                <p className="text-sm text-gray-600">
                  Click "Convert to PDF" to generate your PDF with the current formatting.
                </p>
              </div>
            </div>
          </div>
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