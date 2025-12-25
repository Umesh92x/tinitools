'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowPathIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import yaml from 'js-yaml'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

export function YamlValidator() {
  const [yamlInput, setYamlInput] = useState('')
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    parsed: any
    error?: string
    userFriendlyError?: string
    lineNumber?: number
    suggestion?: string
    problematicLine?: string
  } | null>(null)
  const [jsonOutput, setJsonOutput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  // Function to parse and format YAML error messages for better user understanding
  const formatYamlError = (error: Error, yamlText: string): { message: string; lineNumber?: number; suggestion?: string } => {
    const errorMsg = error.message
    
    // Extract line number and column from various formats:
    // - "(7:1)" format (line:column in parentheses)
    // - "at line 7, column 1" format
    // - "line 7" format
    let lineNumber: number | undefined
    let column: number | undefined
    
    // Try (line:column) format first
    const parenMatch = errorMsg.match(/\((\d+):(\d+)\)/)
    if (parenMatch) {
      lineNumber = parseInt(parenMatch[1])
      column = parseInt(parenMatch[2])
    } else {
      // Try "at line X, column Y" format
      const atLineMatch = errorMsg.match(/at line\s+(\d+)(?:,\s*column\s+(\d+))?/i)
      if (atLineMatch) {
        lineNumber = parseInt(atLineMatch[1])
        if (atLineMatch[2]) column = parseInt(atLineMatch[2])
      } else {
        // Try "line X" format
        const lineMatch = errorMsg.match(/line\s+(\d+)/i)
        if (lineMatch) {
          lineNumber = parseInt(lineMatch[1])
        }
      }
    }
    
    // Get the problematic line if line number is available
    let problematicLine = ''
    if (lineNumber && yamlText) {
      const lines = yamlText.split('\n')
      if (lineNumber > 0 && lineNumber <= lines.length) {
        problematicLine = lines[lineNumber - 1]
      }
    }
    
    // Create user-friendly error message
    let userFriendlyMessage = ''
    let suggestion = ''
    
    // Common YAML errors and their explanations
    if (errorMsg.includes('block mapping entry') && errorMsg.includes('implicit key')) {
      userFriendlyMessage = `Syntax Error at Line ${lineNumber || 'unknown'}: Invalid key format`
      suggestion = `The error occurs because a key is missing its colon (:) or the value is not properly formatted.\n\nCommon causes:\n• Missing colon after a key (should be "key: value")\n• A value appears on a new line without proper indentation\n• A key spans multiple lines incorrectly\n\nFix: Make sure each key is followed by a colon and its value, like:\n  key: value\n\nOr if the value is on the next line, it must be properly indented:\n  key:\n    value`
    } else if (errorMsg.includes('expected') && errorMsg.includes('but found')) {
      userFriendlyMessage = `Syntax Error at Line ${lineNumber || 'unknown'}: Unexpected character or structure`
      suggestion = 'Check for missing colons, incorrect indentation, or unexpected characters. Make sure your YAML structure follows proper syntax.'
    } else if (errorMsg.includes('indentation')) {
      userFriendlyMessage = `Indentation Error at Line ${lineNumber || 'unknown'}: Incorrect spacing`
      suggestion = 'YAML is sensitive to indentation. Use consistent spaces (not tabs) for indentation. Typically 2 spaces per level.'
    } else if (errorMsg.includes('duplicate key')) {
      userFriendlyMessage = `Duplicate Key Error at Line ${lineNumber || 'unknown'}: Key already exists`
      suggestion = 'You have defined the same key twice. Remove the duplicate key or rename one of them.'
    } else if (errorMsg.includes('bad indentation')) {
      userFriendlyMessage = `Indentation Error at Line ${lineNumber || 'unknown'}: Incorrect indentation`
      suggestion = 'Check the indentation of this line. It should match the expected level based on the parent key.'
    } else if (errorMsg.includes('cannot read')) {
      userFriendlyMessage = `Parse Error at Line ${lineNumber || 'unknown'}: Cannot read this section`
      suggestion = 'There might be a syntax issue with the structure. Check for missing colons, incorrect nesting, or invalid characters.'
    } else {
      // Generic error formatting
      userFriendlyMessage = `YAML Error${lineNumber ? ` at Line ${lineNumber}` : ''}`
      suggestion = 'Please check the YAML syntax. Common issues include incorrect indentation, missing colons, or invalid characters.'
    }
    
    // Add line number and column info if available
    if (lineNumber) {
      userFriendlyMessage += ` (Line ${lineNumber}${column ? `, Column ${column}` : ''})`
    }
    
    // Add the technical error for reference (in smaller text)
    const technicalError = errorMsg.replace(/\n/g, ' ').trim()
    
    return {
      message: userFriendlyMessage,
      lineNumber,
      suggestion: suggestion + (technicalError ? `\n\nTechnical details: ${technicalError}` : '')
    }
  }

  const validateYaml = () => {
    if (!yamlInput.trim()) {
      setValidationResult(null)
      setJsonOutput('')
      return
    }

    try {
      const parsed = yaml.load(yamlInput)
      setValidationResult({
        isValid: true,
        parsed,
      })
      setJsonOutput(JSON.stringify(parsed, null, 2))
      showMessage('YAML is valid!')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      const formattedError = formatYamlError(error, yamlInput)
      
      // Get problematic line if line number is available
      let problematicLine = ''
      if (formattedError.lineNumber && yamlInput) {
        const lines = yamlInput.split('\n')
        if (formattedError.lineNumber > 0 && formattedError.lineNumber <= lines.length) {
          problematicLine = lines[formattedError.lineNumber - 1]
        }
      }
      
      setValidationResult({
        isValid: false,
        parsed: null,
        error: error.message,
        userFriendlyError: formattedError.message,
        lineNumber: formattedError.lineNumber,
        suggestion: formattedError.suggestion,
        problematicLine: problematicLine,
      })
      setJsonOutput('')
      showMessage(formattedError.message, 'error')
    }
  }

  const formatYaml = () => {
    if (!yamlInput.trim()) {
      setYamlInput('')
      return
    }

    try {
      const parsed = yaml.load(yamlInput)
      const formatted = yaml.dump(parsed, {
        indent: 2,
        lineWidth: -1,
        quotingType: '"',
      })
      setYamlInput(formatted)
      showMessage('YAML formatted successfully!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error formatting YAML'
      showMessage(errorMsg, 'error')
    }
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml') && file.type !== 'text/yaml') {
      showMessage('Please upload a YAML file', 'error')
      return
    }

    try {
      const fileContent = await file.text()
      setYamlInput(fileContent)
      showMessage('YAML file loaded successfully!')
    } catch (err) {
      showMessage('Failed to read file', 'error')
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileImport,
    accept: { 'text/yaml': ['.yaml', '.yml'] },
    multiple: false,
    noClick: true,
  })

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    showMessage(`${type} copied to clipboard!`)
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('File downloaded!')
  }

  const handleClear = () => {
    setYamlInput('')
    setValidationResult(null)
    setJsonOutput('')
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
                input.accept = '.yaml,.yml'
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleFileImport([file])
                }
                input.click()
              }}
              className="w-full mb-2 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
            >
              📄 Import YAML File
            </button>
          </div>

          <div>
            <label htmlFor="yamlInput" className="block text-sm font-medium text-gray-700">
              YAML Input
            </label>
            <textarea
              id="yamlInput"
              rows={15}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder="Enter your YAML here or import a file..."
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
            />
            {yamlInput && (
              <p className="mt-1 text-xs text-gray-500">
                {yamlInput.length} character{yamlInput.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <div className="ml-3 flex-1">
                    <h3 className={`text-sm font-medium ${
                      validationResult.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {validationResult.isValid ? 'Valid YAML' : 'Invalid YAML'}
                    </h3>
                    {validationResult.userFriendlyError && (
                      <div className="mt-2 space-y-3">
                        <div className="text-sm font-semibold text-red-800">
                          {validationResult.userFriendlyError}
                        </div>
                        
                        {validationResult.problematicLine && (
                          <div className="mt-2 p-2 bg-red-100 rounded border border-red-300">
                            <div className="text-xs font-medium text-red-700 mb-1">
                              Problematic line {validationResult.lineNumber}:
                            </div>
                            <code className="text-xs text-red-900 font-mono block whitespace-pre-wrap">
                              {validationResult.problematicLine}
                            </code>
                          </div>
                        )}
                        
                        {validationResult.suggestion && (
                          <div className="mt-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                            <div className="text-xs font-medium text-yellow-800 mb-1">
                              💡 How to fix:
                            </div>
                            <div className="text-xs text-yellow-900 whitespace-pre-wrap">
                              {validationResult.suggestion}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {validationResult?.isValid && jsonOutput && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    JSON Output
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(jsonOutput, 'JSON')}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => downloadFile(jsonOutput, 'converted.json', 'application/json')}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm max-h-96">
                  {jsonOutput}
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
          disabled={!yamlInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DocumentCheckIcon className="h-4 w-4 mr-2" />
          Validate YAML
        </button>
        <button
          type="button"
          onClick={formatYaml}
          disabled={!yamlInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Format YAML
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
