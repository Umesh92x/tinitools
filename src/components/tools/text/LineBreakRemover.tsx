'use client'

import { useState, useEffect } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type RemovalMode = 'single' | 'paragraph' | 'custom'

export function LineBreakRemover() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<RemovalMode>('single')
  const [customSeparator, setCustomSeparator] = useState(' ')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Real-time processing
  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      return
    }

    let result = ''
    switch (mode) {
      case 'single':
        // Replace all line breaks with a single space
        result = input.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
        break
      case 'paragraph':
        // Replace multiple line breaks with double line breaks, single line breaks with spaces
        result = input
          .replace(/[\r\n]{2,}/g, '\n\n') // Convert multiple line breaks to double line breaks
          .split('\n\n') // Split into paragraphs
          .map(para => para.replace(/[\r\n]+/g, ' ').trim()) // Remove line breaks within paragraphs
          .join('\n\n') // Join paragraphs with double line breaks
          .trim()
        break
      case 'custom':
        // Replace all line breaks with custom separator
        result = input.replace(/[\r\n]+/g, customSeparator).trim()
        break
    }

    setOutput(result)
  }, [input, mode, customSeparator])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setToastMessage('Copied to clipboard!')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Failed to copy to clipboard')
      setShowToast(true)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
    } catch (err) {
      setToastMessage('Failed to paste from clipboard')
      setShowToast(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setMode('single')}
          className={`flex-1 py-2 px-4 rounded-md ${
            mode === 'single'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Single Line
        </button>
        <button
          onClick={() => setMode('paragraph')}
          className={`flex-1 py-2 px-4 rounded-md ${
            mode === 'paragraph'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Paragraphs
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`flex-1 py-2 px-4 rounded-md ${
            mode === 'custom'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Custom
        </button>
      </div>

      {mode === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Custom Separator
          </label>
          <input
            type="text"
            value={customSeparator}
            onChange={(e) => setCustomSeparator(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter custom separator"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Input Text
            </label>
            <button
              onClick={handlePaste}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Paste
            </button>
          </div>
          <textarea
            rows={10}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Output Text
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Copy
              </button>
            )}
          </div>
          <textarea
            rows={10}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={output}
            readOnly
            placeholder="Processed text will appear here..."
          />
        </div>
      </div>

      {input && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Processing happens automatically as you type! Changes update in real-time.
          </p>
        </div>
      )}

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 