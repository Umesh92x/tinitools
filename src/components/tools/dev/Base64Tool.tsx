'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type Mode = 'encode' | 'decode'
type InputType = 'text' | 'file'

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode')
  const [inputType, setInputType] = useState<InputType>('text')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [fileName, setFileName] = useState('')

  const handleTextEncode = () => {
    if (!input.trim()) {
      setToastMessage('Please enter some text to encode')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const encoder = new TextEncoder()
      const bytes = encoder.encode(input)
      let binary = ''
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte)
      })
      const encoded = btoa(binary)
      setOutput(encoded)
      setToastMessage('Text encoded successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Error encoding text: Invalid characters')
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleTextDecode = () => {
    if (!input.trim()) {
      setToastMessage('Please enter some base64 text to decode')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const binary = atob(input)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const decoder = new TextDecoder()
      const decoded = decoder.decode(bytes)
      setOutput(decoded)
      setToastMessage('Text decoded successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Error decoding text: Invalid base64 string')
      setToastType('error')
      setShowToast(true)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setFileName(file.name)

    try {
      const buffer = await file.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      
      if (mode === 'encode') {
        let binary = ''
        bytes.forEach(byte => binary += String.fromCharCode(byte))
        const base64 = btoa(binary)
        setOutput(base64)
        setToastMessage('File encoded successfully!')
      } else {
        try {
          const decoded = atob(await file.text())
          const bytes = new Uint8Array(decoded.length)
          for (let i = 0; i < decoded.length; i++) {
            bytes[i] = decoded.charCodeAt(i)
          }
          const blob = new Blob([bytes])
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `decoded_${file.name}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          setToastMessage('File decoded and downloaded successfully!')
        } catch (error) {
          throw new Error('Invalid base64 file content')
        }
      }
      
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage(`Error ${mode}ing file: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setToastType('error')
      setShowToast(true)
    }
  }, [mode])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setToastMessage('Output copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Failed to copy to clipboard')
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleProcess = () => {
    if (inputType === 'text') {
      if (mode === 'encode') {
        handleTextEncode()
      } else {
        handleTextDecode()
      }
    }
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
    setFileName('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="space-x-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'encode'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'decode'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Decode
          </button>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => setInputType('text')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              inputType === 'text'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setInputType('file')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              inputType === 'file'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            File
          </button>
        </div>
      </div>

      {inputType === 'text' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text to ${mode}...`}
              rows={10}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output
            </label>
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 font-mono text-sm"
            />
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <div className="text-gray-600">
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <p>Drag and drop a file here, or click to select</p>
              )}
            </div>
            {fileName && (
              <p className="text-sm text-gray-500">Selected file: {fileName}</p>
            )}
            <p className="text-sm text-gray-500">
              {mode === 'encode'
                ? 'File will be encoded to base64'
                : 'Base64 file will be decoded and downloaded'}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {inputType === 'text' && (
          <>
            <button
              onClick={handleProcess}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>

            {output && (
              <button
                onClick={handleCopy}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Copy Output
              </button>
            )}

            <button
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </>
        )}
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