'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowPathIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

export function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const validateJson = (jsonString: string): { valid: boolean; error?: string } => {
    try {
      JSON.parse(jsonString)
      return { valid: true }
    } catch (err) {
      return {
        valid: false,
        error: err instanceof Error ? err.message : 'Invalid JSON',
      }
    }
  }

  const formatJson = (minify: boolean = false) => {
    try {
      setError('')
      if (!jsonInput.trim()) {
        setJsonOutput('')
        setIsValid(null)
        return
      }

      const validation = validateJson(jsonInput)
      if (!validation.valid) {
        setError(validation.error || 'Invalid JSON')
        setIsValid(false)
        setJsonOutput('')
        showMessage(validation.error || 'Invalid JSON', 'error')
        return
      }

      const parsed = JSON.parse(jsonInput)
      const formatted = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indentSize)

      setJsonOutput(formatted)
      setIsValid(true)
      showMessage(minify ? 'JSON minified successfully!' : 'JSON formatted successfully!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error formatting JSON'
      setError(errorMsg)
      setIsValid(false)
      showMessage(errorMsg, 'error')
      console.error(err)
    }
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Please upload a JSON file')
      showMessage('Please upload a JSON file', 'error')
      return
    }

    try {
      const fileContent = await file.text()
      setJsonInput(fileContent)
      showMessage('JSON file loaded successfully!')
    } catch (err) {
      setError('Failed to read file')
      showMessage('Failed to read file', 'error')
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileImport,
    accept: { 'application/json': ['.json'] },
    multiple: false,
    noClick: true,
  })

  const copyToClipboard = () => {
    if (!jsonOutput) return
    navigator.clipboard.writeText(jsonOutput)
    showMessage('JSON copied to clipboard!')
  }

  const downloadJson = () => {
    if (!jsonOutput) return
    const blob = new Blob([jsonOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('JSON file downloaded!')
  }

  const handleClear = () => {
    setJsonInput('')
    setJsonOutput('')
    setError('')
    setIsValid(null)
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
                input.accept = '.json'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleFileImport([file])
                }
                input.click()
              }}
              className="w-full mb-2 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
            >
              📄 Import JSON File
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700">
                JSON Input
              </label>
              {isValid !== null && (
                <span className={`text-xs px-2 py-1 rounded ${
                  isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isValid ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            <textarea
              id="jsonInput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your JSON here or import a file..."
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
                if (e.target.value.trim()) {
                  const validation = validateJson(e.target.value)
                  setIsValid(validation.valid)
                  if (!validation.valid) {
                    setError(validation.error || 'Invalid JSON')
                  } else {
                    setError('')
                  }
                } else {
                  setIsValid(null)
                  setError('')
                }
              }}
            />
            {jsonInput && (
              <p className="mt-1 text-xs text-gray-500">
                {jsonInput.length} character{jsonInput.length !== 1 ? 's' : ''}
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
              <label htmlFor="jsonOutput" className="block text-sm font-medium text-gray-700">
                Formatted JSON
              </label>
              {jsonOutput && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Copy
                  </button>
                  <button
                    onClick={downloadJson}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            <textarea
              id="jsonOutput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={jsonOutput}
              readOnly
              placeholder="Formatted JSON will appear here..."
            />
            {jsonOutput && (
              <p className="mt-1 text-xs text-gray-500">
                {jsonOutput.length} character{jsonOutput.length !== 1 ? 's' : ''}
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
          onClick={() => formatJson(false)}
          disabled={!jsonInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DocumentCheckIcon className="h-4 w-4 mr-2" />
          Format JSON
        </button>
        <button
          type="button"
          onClick={() => formatJson(true)}
          disabled={!jsonInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Minify JSON
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

