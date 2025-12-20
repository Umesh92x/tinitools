'use client'

import { useState } from 'react'
import { ArrowPathIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import yaml from 'js-yaml'

export function YamlValidator() {
  const [yamlInput, setYamlInput] = useState('')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    parsed: any
    error?: string
  } | null>(null)

  const validateYaml = () => {
    if (!yamlInput.trim()) {
      setValidationResult(null)
      return
    }

    try {
      const parsed = yaml.load(yamlInput)
      setValidationResult({
        isValid: true,
        parsed,
      })
    } catch (err) {
      setValidationResult({
        isValid: false,
        parsed: null,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      })
    }
  }

  const handleClear = () => {
    setYamlInput('')
    setValidationResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="yamlInput" className="block text-sm font-medium text-gray-700">
              YAML Input
            </label>
            <textarea
              id="yamlInput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your YAML here..."
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Validation Result
            </label>
            {validationResult && (
              <div className={`mt-1 p-4 rounded-md ${
                validationResult.isValid ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {validationResult.isValid ? (
                      <div className="h-5 w-5 text-green-400">✓</div>
                    ) : (
                      <div className="h-5 w-5 text-red-400">✗</div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      validationResult.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.isValid ? 'Valid YAML' : 'Invalid YAML'}
                    </h3>
                    {validationResult.error && (
                      <div className="mt-2 text-sm text-red-700">
                        <p>{validationResult.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {validationResult?.isValid && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parsed Structure
                </label>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(validationResult.parsed, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={validateYaml}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <DocumentCheckIcon className="h-4 w-4 mr-2" />
          Validate YAML
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