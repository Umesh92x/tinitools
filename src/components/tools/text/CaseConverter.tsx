'use client'

import { useState } from 'react'
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

export function CaseConverter() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [showToast, setShowToast] = useState(false)

  const handleTransform = (transform: (text: string) => string) => {
    setResult(transform(text))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setShowToast(true)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="input" className="block text-sm font-medium text-gray-700">
          Input Text
        </label>
        <textarea
          id="input"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {transformations.map((t) => (
          <button
            key={t.name}
            onClick={() => handleTransform(t.transform)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t.name}
          </button>
        ))}
      </div>

      {result && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="result" className="block text-sm font-medium text-gray-700">
              Result
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Copy to clipboard
            </button>
          </div>
          <textarea
            id="result"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={result}
            readOnly
          />
        </div>
      )}

      <Toast
        show={showToast}
        message="Text copied to clipboard!"
        type="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 