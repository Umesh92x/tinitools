'use client'

import { useState } from 'react'
import { ArrowPathIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'

export function XmlFormatter() {
  const [xmlInput, setXmlInput] = useState('')
  const [xmlOutput, setXmlOutput] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [error, setError] = useState('')

  const formatXml = () => {
    try {
      setError('')
      if (!xmlInput.trim()) {
        setXmlOutput('')
        return
      }

      // Basic XML formatting function
      const format = (xml: string, indent: number): string => {
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

      // Basic XML validation
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlInput, 'text/xml')
      const parseError = doc.querySelector('parsererror')
      if (parseError) {
        throw new Error('Invalid XML: ' + parseError.textContent)
      }

      setXmlOutput(format(xmlInput, indentSize))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error formatting XML')
      console.error(err)
    }
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
          <div>
            <label htmlFor="xmlInput" className="block text-sm font-medium text-gray-700">
              XML Input
            </label>
            <textarea
              id="xmlInput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your XML here..."
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
            />
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
            <label htmlFor="xmlOutput" className="block text-sm font-medium text-gray-700">
              Formatted XML
            </label>
            <textarea
              id="xmlOutput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={xmlOutput}
              readOnly
              placeholder="Formatted XML will appear here..."
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
          onClick={formatXml}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <DocumentCheckIcon className="h-4 w-4 mr-2" />
          Format XML
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