'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

export function JsonToCsvConverter() {
  const [jsonInput, setJsonInput] = useState('')
  const [csvOutput, setCsvOutput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [autoConvert, setAutoConvert] = useState(false)
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [flattenNested, setFlattenNested] = useState(true)

  // Function to flatten nested objects with dot notation
  const flattenObject = (obj: any, prefix = '', result: Record<string, any> = {}): Record<string, any> => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key
        const value = obj[key]
        
        if (value === null || value === undefined) {
          result[newKey] = ''
        } else if (Array.isArray(value)) {
          // Handle arrays - convert to JSON string or comma-separated values
          result[newKey] = JSON.stringify(value)
        } else if (typeof value === 'object') {
          // Recursively flatten nested objects
          flattenObject(value, newKey, result)
        } else {
          result[newKey] = value
        }
      }
    }
    return result
  }

  const convertToCsv = useCallback(() => {
    try {
      setError('')
      if (!jsonInput.trim()) {
        setCsvOutput('')
        return
      }

      // Parse JSON input
      const parsed = JSON.parse(jsonInput) as any
      let jsonData: Record<string, any>[]
      
      // Handle single object by wrapping it in an array
      if (!Array.isArray(parsed)) {
        if (typeof parsed === 'object' && parsed !== null) {
          jsonData = [parsed as Record<string, any>]
        } else {
          throw new Error('Input must be an object or an array of objects')
        }
      } else {
        jsonData = parsed as Record<string, any>[]
      }
      
      if (jsonData.length === 0) {
        setCsvOutput('')
        return
      }
      
      // Validate that all items are objects
      if (!jsonData.every((item: any) => typeof item === 'object' && item !== null && !Array.isArray(item))) {
        throw new Error('All items in the array must be objects')
      }

      // Flatten nested objects if enabled
      const processedData = flattenNested
        ? jsonData.map((item: Record<string, any>) => flattenObject(item))
        : jsonData

      // Get all possible headers from all objects
      const headers = new Set<string>()
      processedData.forEach((item: Record<string, any>) => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => headers.add(key))
        }
      })

      // Convert headers set to array and sort for consistency
      const headerArray = Array.from(headers).sort()

      // Create CSV rows
      const rows = [
        // Header row
        headerArray.join(delimiter),
        // Data rows
        ...processedData.map((item: Record<string, any>) => {
          return headerArray.map(header => {
            const value = item[header]
            // Handle different value types and escape special characters
            if (value === null || value === undefined) return ''
            const stringValue = String(value)
            // Escape delimiter and quotes
            if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
          }).join(delimiter)
        })
      ]

      const csvResult = rows.join('\n')
      setCsvOutput(csvResult)
      setToastMessage(`Successfully converted ${jsonData.length} object${jsonData.length !== 1 ? 's' : ''} to CSV`)
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error converting JSON to CSV'
      setError(errorMsg)
      setToastMessage(errorMsg)
      setToastType('error')
      setShowToast(true)
      console.error(err)
    }
  }, [jsonInput, delimiter, flattenNested])

  useEffect(() => {
    if (autoConvert && jsonInput.trim()) {
      convertToCsv()
    }
  }, [autoConvert, convertToCsv])

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Please upload a JSON file')
      setToastMessage('Please upload a JSON file')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const fileContent = await file.text()
      setJsonInput(fileContent)
      setToastMessage('JSON file loaded successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      setError('Failed to read file')
      setToastMessage('Failed to read file')
      setToastType('error')
      setShowToast(true)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileImport,
    accept: { 'application/json': ['.json'] },
    multiple: false,
    noClick: true,
  })

  const copyToClipboard = () => {
    if (!csvOutput) return
    navigator.clipboard.writeText(csvOutput)
    setToastMessage('CSV copied to clipboard!')
    setToastType('success')
    setShowToast(true)
  }

  const downloadCsv = () => {
    if (!csvOutput) return
    const blob = new Blob([csvOutput], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.csv'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setToastMessage('CSV file downloaded!')
    setToastType('success')
    setShowToast(true)
  }

  const handleClear = () => {
    setJsonInput('')
    setCsvOutput('')
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
              id="jsonInput"
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your JSON array here or import a file..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Input can be a single object or an array of objects, e.g., &#123;"name": "John", "age": 30&#125; or [&#123;"name": "John"&#125;, &#123;"name": "Jane"&#125;]
            </p>
            {jsonInput && (
              <p className="mt-1 text-xs text-gray-500">
                {jsonInput.length} character{jsonInput.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="delimiter" className="block text-sm font-medium text-gray-700">
                Delimiter
              </label>
              <select
                id="delimiter"
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="flattenNested"
                checked={flattenNested}
                onChange={(e) => setFlattenNested(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="flattenNested" className="ml-2 block text-sm text-gray-900">
                Flatten nested objects (uses dot notation, e.g., "glossary.title")
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="csvOutput" className="block text-sm font-medium text-gray-700">
                CSV Output
              </label>
              {csvOutput && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Copy
                  </button>
                  <button
                    onClick={downloadCsv}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            <textarea
              id="csvOutput"
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={csvOutput}
              readOnly
              placeholder="CSV output will appear here..."
            />
            {csvOutput && (
              <p className="mt-1 text-xs text-gray-500">
                {csvOutput.split('\n').length} row{csvOutput.split('\n').length !== 1 ? 's' : ''}
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
          onClick={convertToCsv}
          disabled={!jsonInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowDownIcon className="h-4 w-4 mr-2" />
          Convert to CSV
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
