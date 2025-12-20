'use client'

import { useState, useEffect } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface PageSettings {
  pageSize: 'A4' | 'Letter' | 'Legal'
  fontSize: number
  lineHeight: number
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
  font: StandardFonts
}

const defaultSettings: PageSettings = {
  pageSize: 'A4',
  fontSize: 12,
  lineHeight: 1.5,
  marginTop: 72, // 1 inch = 72 points
  marginRight: 72,
  marginBottom: 72,
  marginLeft: 72,
  font: StandardFonts.Helvetica,
}

const pageSizes = {
  A4: { width: 595.28, height: 841.89 }, // A4 in points
  Letter: { width: 612, height: 792 }, // US Letter in points
  Legal: { width: 612, height: 1008 }, // Legal in points
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
  const [converting, setConverting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const updateSetting = <K extends keyof PageSettings>(
    key: K,
    value: PageSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const convertToPDF = async () => {
    if (!text.trim()) {
      setToastMessage('Please enter some text to convert')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      setConverting(true)
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(settings.font)

      const pageSize = pageSizes[settings.pageSize]
      let currentPage = pdfDoc.addPage([pageSize.width, pageSize.height])

      // Split text into paragraphs
      const paragraphs = text.split(/\n\n+/)
      let yPosition = pageSize.height - settings.marginTop
      const lineHeight = settings.fontSize * settings.lineHeight
      const maxWidth = pageSize.width - settings.marginLeft - settings.marginRight

      for (const paragraph of paragraphs) {
        // Add extra space between paragraphs
        if (yPosition !== pageSize.height - settings.marginTop) {
          yPosition -= lineHeight
        }

        // Split paragraph into words
        const words = paragraph.split(/\s+/)
        let currentLine = ''

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const testWidth = font.widthOfTextAtSize(testLine, settings.fontSize)

          if (testWidth > maxWidth) {
            // Write current line
            currentPage.drawText(currentLine, {
              x: settings.marginLeft,
              y: yPosition,
              size: settings.fontSize,
              font,
              color: rgb(0, 0, 0),
            })

            // Move to next line
            currentLine = word
            yPosition -= lineHeight

            // Check if we need a new page
            if (yPosition < settings.marginBottom) {
              currentPage = pdfDoc.addPage([pageSize.width, pageSize.height])
              yPosition = pageSize.height - settings.marginTop
            }
          } else {
            currentLine = testLine
          }
        }

        // Write remaining line of the paragraph
        if (currentLine) {
          currentPage.drawText(currentLine, {
            x: settings.marginLeft,
            y: yPosition,
            size: settings.fontSize,
            font,
            color: rgb(0, 0, 0),
          })
          yPosition -= lineHeight
        }

        // Check if we need a new page for the next paragraph
        if (yPosition < settings.marginBottom) {
          currentPage = pdfDoc.addPage([pageSize.width, pageSize.height])
          yPosition = pageSize.height - settings.marginTop
        }
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'converted.pdf'
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setToastMessage('Text converted to PDF successfully!')
      setToastType('success')
    } catch (error) {
      console.error('Conversion error:', error)
      setToastMessage('Error converting text to PDF')
      setToastType('error')
    } finally {
      setConverting(false)
      setShowToast(true)
    }
  }

  // Add this function to calculate preview dimensions
  const getPreviewDimensions = () => {
    const pageSize = pageSizes[settings.pageSize]
    const scale = 0.4 // Scale factor to fit the preview
    return {
      width: pageSize.width * scale,
      height: pageSize.height * scale,
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

            <div className="mt-4">
              <button
                onClick={convertToPDF}
                disabled={!text.trim() || converting}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {converting ? 'Converting...' : 'Convert to PDF'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Page Settings</h3>

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
              <p className="mt-1 text-xs text-gray-500">
                {settings.pageSize === 'A4'
                  ? '210 × 297 mm'
                  : settings.pageSize === 'Letter'
                  ? '8.5 × 11 inches'
                  : '8.5 × 14 inches'}
              </p>
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