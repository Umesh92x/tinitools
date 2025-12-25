'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

export function Base64Converter() {
  const [textInput, setTextInput] = useState('')
  const [base64Output, setBase64Output] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const encodeBase64 = () => {
    try {
      setError('')
      if (!textInput.trim()) {
        setBase64Output('')
        return
      }

      const encoded = btoa(unescape(encodeURIComponent(textInput)))
      setBase64Output(encoded)
      showMessage('Text encoded to Base64!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error encoding to Base64'
      setError(errorMsg)
      showMessage(errorMsg, 'error')
      console.error(err)
    }
  }

  const decodeBase64 = () => {
    try {
      setError('')
      if (!textInput.trim()) {
        setBase64Output('')
        return
      }

      const decoded = decodeURIComponent(escape(atob(textInput.trim())))
      setBase64Output(decoded)
      showMessage('Base64 decoded to text!')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid Base64 string'
      setError(errorMsg)
      showMessage(errorMsg, 'error')
      console.error(err)
    }
  }

  const handleConvert = () => {
    if (mode === 'encode') {
      encodeBase64()
    } else {
      decodeBase64()
    }
  }

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      if (mode === 'encode') {
        // Read file as base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          // Remove data URL prefix if present
          const base64 = result.includes(',') ? result.split(',')[1] : result
          setBase64Output(base64)
          showMessage('File encoded to Base64!')
        }
        reader.readAsDataURL(file)
      } else {
        // For decode, read as text and decode
        const fileContent = await file.text()
        setTextInput(fileContent)
        showMessage('File loaded! Click decode to convert.')
      }
    } catch (err) {
      showMessage('Failed to read file', 'error')
    }
  }, [mode])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileImport,
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
    setTextInput('')
    setBase64Output('')
    setError('')
  }

  const swapMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    // Swap inputs
    const temp = textInput
    setTextInput(base64Output)
    setBase64Output(temp)
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
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) handleFileImport([file])
                }
                input.click()
              }}
              className="w-full mb-2 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
            >
              📄 Import File
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="textInput" className="block text-sm font-medium text-gray-700">
                {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
              </label>
            </div>
            <textarea
              id="textInput"
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            {textInput && (
              <p className="mt-1 text-xs text-gray-500">
                {textInput.length} character{textInput.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="base64Output" className="block text-sm font-medium text-gray-700">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </label>
              {base64Output && (
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(base64Output, mode === 'encode' ? 'Base64' : 'Text')}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadFile(
                      base64Output,
                      mode === 'encode' ? 'encoded.txt' : 'decoded.txt',
                      'text/plain'
                    )}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>
            <textarea
              id="base64Output"
              rows={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
              value={base64Output}
              readOnly
              placeholder={mode === 'encode' ? 'Base64 output will appear here...' : 'Decoded text will appear here...'}
            />
            {base64Output && (
              <p className="mt-1 text-xs text-gray-500">
                {base64Output.length} character{base64Output.length !== 1 ? 's' : ''}
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
          onClick={() => setMode('encode')}
          className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            mode === 'encode'
              ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500'
          }`}
        >
          Encode
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            mode === 'decode'
              ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500'
          }`}
        >
          Decode
        </button>
        <button
          type="button"
          onClick={handleConvert}
          disabled={!textInput.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-2">⇄</span>
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button
          type="button"
          onClick={swapMode}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          title="Swap input and output"
        >
          ⇄ Swap
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

