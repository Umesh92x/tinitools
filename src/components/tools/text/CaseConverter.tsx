'use client'

import { useState, useEffect } from 'react'
import { Copy, X, Sparkles } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'

const transformations = [
  { name: 'UPPERCASE', transform: (text: string) => text.toUpperCase() },
  { name: 'lowercase', transform: (text: string) => text.toLowerCase() },
  { name: 'Title Case', transform: (text: string) => {
    return text.replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    })
  }},
  { name: 'Sentence case', transform: (text: string) => {
    return text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase())
  }},
  { name: 'aLtErNaTiNg CaSe', transform: (text: string) => {
    return text.split('').map((char, i) => 
      i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    ).join('')
  }},
  { name: 'INVERSE CASE', transform: (text: string) => {
    return text.split('').map(char => {
      if (char === char.toUpperCase()) return char.toLowerCase()
      return char.toUpperCase()
    }).join('')
  }},
]

const exampleText = "Hello World! This is an example text. You can convert it to different cases."

export function CaseConverter() {
  const [text, setText] = useState('')
  const [activeTransform, setActiveTransform] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Real-time conversion
  const getResult = () => {
    if (!text || !activeTransform) return ''
    const transform = transformations.find(t => t.name === activeTransform)
    return transform ? transform.transform(text) : ''
  }

  const result = getResult()

  const handleCopy = async (textToCopy: string, label: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setToastMessage(`${label} copied to clipboard!`)
      setShowToast(true)
    } catch (err) {
      console.error('Failed to copy text:', err)
      setToastMessage('Failed to copy text')
      setShowToast(true)
    }
  }

  const loadExample = () => {
    setText(exampleText)
    if (!activeTransform) {
      setActiveTransform('Title Case')
    }
  }

  const clearText = () => {
    setText('')
    setActiveTransform(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700">
            Input Text
          </label>
          <div className="flex gap-2">
            <button
              onClick={loadExample}
              className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              <Sparkles className="w-4 h-4" />
              Try Example
            </button>
            {text && (
              <button
                onClick={clearText}
                className="text-sm text-gray-600 hover:text-gray-500 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          id="input"
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your text here... (conversion happens automatically)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text && (
          <p className="mt-1 text-xs text-gray-500">
            Characters: {text.length} | Words: {text.trim().split(/\s+/).filter(Boolean).length}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Case Type (converts automatically)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {transformations.map((t) => {
            const isActive = activeTransform === t.name
            const transformedText = text ? t.transform(text) : ''
            return (
              <div key={t.name} className="relative">
                <button
                  onClick={() => setActiveTransform(isActive ? null : t.name)}
                  className={`w-full px-4 py-3 text-sm font-medium rounded-md border-2 transition-all ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {t.name}
                </button>
                {isActive && transformedText && (
                  <button
                    onClick={() => handleCopy(transformedText, t.name)}
                    className="absolute top-1 right-1 p-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {result && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="result" className="block text-sm font-medium text-gray-700">
              Result ({activeTransform})
            </label>
            <button
              onClick={() => handleCopy(result, 'Result')}
              className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              <Copy className="w-4 h-4" />
              Copy to clipboard
            </button>
          </div>
          <textarea
            id="result"
            rows={6}
            className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
            value={result}
            readOnly
          />
          <p className="mt-1 text-xs text-gray-500">
            Characters: {result.length} | Words: {result.trim().split(/\s+/).filter(Boolean).length}
          </p>
        </div>
      )}

      {!text && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Type or paste your text above, then select a case type to see the conversion instantly!
          </p>
        </div>
      )}

      <Toast
        show={showToast}
        message={toastMessage}
        type="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 