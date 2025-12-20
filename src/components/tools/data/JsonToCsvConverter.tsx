'use client'

import { useState } from 'react'
import { ArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export function JsonToCsvConverter() {
  const [jsonInput, setJsonInput] = useState('')
  const [csvOutput, setCsvOutput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [error, setError] = useState('')

  const convertToCsv = () => {
    try {
      setError('')
      if (!jsonInput.trim()) {
        setCsvOutput('')
        return
      }

      // Parse JSON input
      const jsonData = JSON.parse(jsonInput)
      if (!Array.isArray(jsonData)) {
        throw new Error('Input must be an array of objects')
      }
      if (jsonData.length === 0) {
        setCsvOutput('')
        return
      }

      // Get all possible headers from all objects
      const headers = new Set<string>()
      jsonData.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => headers.add(key))
        }
      })

      // Convert headers set to array
      const headerArray = Array.from(headers)

      // Create CSV rows
      const rows = [
        // Header row
        headerArray.join(delimiter),
        // Data rows
        ...jsonData.map(item => {
          return headerArray.map(header => {
            const value = item[header]
            // Handle different value types and escape special characters
            if (value === null || value === undefined) return ''
            if (typeof value === 'object') return JSON.stringify(value)
            const stringValue = String(value)
            // Escape delimiter and quotes
            if (stringValue.includes(delimiter) || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`
            }
            return stringValue
          }).join(delimiter)
        })
      ]

      setCsvOutput(rows.join('\n'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error converting JSON to CSV')
      console.error(err)
    }
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
          <div>
            <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-700">
              JSON Input
            </label>
            <textarea
              id="jsonInput"
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your JSON array here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">
              Input must be an array of objects, e.g., [{'"name": "John", "age": 30'}]
            </p>
          </div>
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
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="csvOutput" className="block text-sm font-medium text-gray-700">
              CSV Output
            </label>
            <textarea
              id="csvOutput"
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={csvOutput}
              readOnly
              placeholder="CSV output will appear here..."
            />
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
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
    </div>
  )
} 