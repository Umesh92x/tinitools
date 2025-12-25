'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowPathIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

export function XmlFormatter() {
  const [xmlInput, setXmlInput] = useState('')
  const [xmlOutput, setXmlOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const formatXml = (xml: string, indent: number): string => {
    let formatted = ''
    let indentLevel = 0
    const lines = xml
      .replace(/(>)(<)(\/*)/g, '$1\n$2$3') // Add newline between '>' and '<'
      .replace(/\r?\n/g, '\n')             // Normalize line breaks
      .split('\n')

    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      // Decrease indent for closing tags and self-closing tags
      if (trimmedLine.startsWith('</') || trimmedLine.endsWith('/>')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }

      // Add line with proper indentation
      formatted += ' '.repeat(indentLevel * indent) + trimmedLine + '\n'

      // Increase indent for opening tags
      if (
        trimmedLine.startsWith('<') &&
        !trimmedLine.startsWith('</') &&
        !trimmedLine.endsWith('/>') &&
        !trimmedLine.endsWith('</>')
      ) {
        indentLevel++
      }
    })

    return formatted.trim()
  }

  const minifyXml = (xml: string): string => {
    return xml
      .replace(/>\s+</g, '><')  // Remove whitespace between tags
      .replace(/\s+/g, ' ')      // Replace multiple spaces with single space
      .trim()
  }

  const handleFormat = (minify: boolean = false) => {
    try {
      setError('')
      if (!xmlInput.trim()) {
        setXmlOutput('')
        return
      }

      // Basic XML validation
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlInput, 'text/xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        throw new Error('Invalid XML: ' + parseError.textContent)
      }

      const result = minify ? minifyXml(xmlInput) : formatXml(xmlInput, indentSize)
      setXmlOutput(result)
      showMessage(minify ? 'XML minified successfully!' : 'XML formatted successfully!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error formatting XML'
      setError(errorMsg)
      showMessage(errorMsg, 'error')
      console.error(err)
    }
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith('.xml') && file.type !== 'text/xml' && file.type !== 'application/xml') {
      setError('Please upload an XML file')
      showMessage('Please upload an XML file', 'error')
      return
    }

    try {
      const fileContent = await file.text()
      setXmlInput(fileContent)
      showMessage('XML file loaded successfully!')
    } catch (err) {
      setError('Failed to read file')
      showMessage('Failed to read file', 'error')
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileImport,
    accept: { 'text/xml': ['.xml'], 'application/xml': ['.xml'] },
    multiple: false,
    noClick: true,
  })

  const copyToClipboard = () => {
    if (!xmlOutput) return
    navigator.clipboard.writeText(xmlOutput)
    showMessage('XML copied to clipboard!')
  }

  const downloadXml = () => {
    if (!xmlOutput) return
    const blob = new Blob([xmlOutput], { type: 'text/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.xml'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('XML file downloaded!')
  }

  const handleClear = () => {
    setXmlInput('')
    setXmlOutput('')
    setError('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div {...getRootProps()} className="w-full">
            <input {...getInputProps()} />
            <button
              type="button"
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.xml'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleFileImport([file])
                }
                input.click()
              }}
              className="w-full mb-2 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
            >
              📄 Import XML File
            </button>
          </div>

          <div>
            <label htmlFor="xmlInput" className="block text-sm font-medium text-gray-700">
              XML Input
            </label>
            <textarea
              id="xmlInput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your XML here or import a file..."
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
            />
            {xmlInput && (
              <p className="mt-1 text-xs text-gray-500">
                {xmlInput.length} character{xmlInput.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="indentSize" className="block text-sm font-medium text-gray-700">
              Indent Size
            </label>
            <select
              id="indentSize"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="xmlOutput" className="block text-sm font-medium text-gray-700">
                Formatted XML
              </label>
              {xmlOutput && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Copy
                  </button>
                  <button
                    onClick={downloadXml}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            <textarea
              id="xmlOutput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={xmlOutput}
              readOnly
              placeholder="Formatted XML will appear here..."
            />
            {xmlOutput && (
              <p className="mt-1 text-xs text-gray-500">
                {xmlOutput.length} character{xmlOutput.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={() => handleFormat(false)}
          disabled={!xmlInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DocumentCheckIcon className="h-4 w-4 mr-2" />
          Format XML
        </button>
        <button
          type="button"
          onClick={() => handleFormat(true)}
          disabled={!xmlInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Minify XML
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Clear
        </button>
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
