'use client'

import { useState } from 'react'
import { ArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export function CsvToJsonConverter() {
  const [csvInput, setCsvInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [delimiter, setDelimiter] = useState(',')
  const [hasHeader, setHasHeader] = useState(true)
  const [error, setError] = useState('')

  const convertToJson = () => {
    try {
      setError('')
      if (!csvInput.trim()) {
        setJsonOutput('')
        return
      }

      const lines = csvInput.trim().split('\n')
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

      setJsonOutput(JSON.stringify(jsonArray, null, 2))
    } catch (err) {
      setError('Error converting CSV to JSON. Please check your input format.')
      console.error(err)
    }
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
          <div>
            <label htmlFor="csvInput" className="block text-sm font-medium text-gray-700">
              CSV Input
            </label>
            <textarea
              id="csvInput"
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your CSV data here..."
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />
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
            <label htmlFor="jsonOutput" className="block text-sm font-medium text-gray-700">
              JSON Output
            </label>
            <textarea
              id="jsonOutput"
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={jsonOutput}
              readOnly
              placeholder="JSON output will appear here..."
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
          onClick={convertToJson}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
    </div>
  )
} 