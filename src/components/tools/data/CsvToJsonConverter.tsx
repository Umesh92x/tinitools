'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

export function CsvToJsonConverter() {
  const [csvInput, setCsvInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [autoConvert, setAutoConvert] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const convertToJson = useCallback(() => {
    try {
      setError('')
      if (!csvInput.trim()) {
        setJsonOutput('')
        return
      }

      const lines = csvInput.trim().split('\n').filter(line => line.trim())
      if (lines.length === 0) {
        throw new Error('CSV is empty')
      }

      const headers = hasHeader
        ? lines[0].split(delimiter).map(header => header.trim())
        : lines[0].split(delimiter).map((_, index) => `column${index + 1}`)

      const jsonArray = lines
        .slice(hasHeader ? 1 : 0)
        .map(line => {
          const values = line.split(delimiter)
          const obj: Record<string, string> = {}
          headers.forEach((header, index) => {
            obj[header] = values[index]?.trim() || ''
          })
          return obj
        })

      const formattedJson = JSON.stringify(jsonArray, null, 2)
      setJsonOutput(formattedJson)
      showMessage(`Successfully converted ${jsonArray.length} row${jsonArray.length !== 1 ? 's' : ''} to JSON`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error converting CSV to JSON. Please check your input format.'
      setError(errorMsg)
      showMessage(errorMsg, 'error')
      console.error(err)
    }
  }, [csvInput, delimiter, hasHeader])

  useEffect(() => {
    if (autoConvert && csvInput.trim()) {
      convertToJson()
    }
  }, [autoConvert, convertToJson])

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a CSV file')
      showMessage('Please upload a CSV file', 'error')
      return
    }

    try {
      const fileContent = await file.text()
      setCsvInput(fileContent)
      showMessage('CSV file loaded successfully!')
    } catch (err) {
      setError('Failed to read file')
      showMessage('Failed to read file', 'error')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileImport,
    accept: { 'text/csv': ['.csv'] },
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
    a.download = 'converted.json'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('JSON file downloaded!')
  }

  const handleClear = () => {
    setCsvInput('')
    setJsonOutput('')
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
                input.accept = '.csv'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleFileImport([file])
                }
                input.click()
              }}
              className="w-full mb-2 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
            >
              📄 Import CSV File
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="csvInput" className="block text-sm font-medium text-gray-700">
                CSV Input
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoConvert"
                  checked={autoConvert}
                  onChange={(e) => setAutoConvert(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="autoConvert" className="ml-2 text-xs text-gray-600">
                  Auto-convert
                </label>
              </div>
            </div>
            <textarea
              id="csvInput"
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your CSV data here or import a file..."
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />
            {csvInput && (
              <p className="mt-1 text-xs text-gray-500">
                {csvInput.split('\n').length} line{csvInput.split('\n').length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700">
                Delimiter
              </label>
              <select
                id="delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <input
                id="hasHeader"
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="hasHeader" className="ml-2 block text-sm text-gray-900">
                First row is header
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="jsonOutput" className="block text-sm font-medium text-gray-700">
                JSON Output
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
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={jsonOutput}
              readOnly
              placeholder="JSON output will appear here..."
            />
            {jsonOutput && (
              <p className="mt-1 text-xs text-gray-500">
                {JSON.parse(jsonOutput).length} object{JSON.parse(jsonOutput).length !== 1 ? 's' : ''}
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
          onClick={convertToJson}
          disabled={!csvInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowDownIcon className="h-4 w-4 mr-2" />
          Convert to JSON
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