'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type GeneratorType = 'paragraphs' | 'words' | 'bytes'

const LOREM_WORDS = `Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum`.split(' ')

export function LoremIpsumGenerator() {
  const [type, setType] = useState<GeneratorType>('paragraphs')
  const [amount, setAmount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const generateRandomWord = () => {
    return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
  }

  const generateRandomSentence = (minWords = 5, maxWords = 15) => {
    const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
    const words = Array.from({ length }, generateRandomWord)
    return words.join(' ') + '.'
  }

  const generateRandomParagraph = (minSentences = 3, maxSentences = 7) => {
    const length = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences
    const sentences = Array.from({ length }, () => generateRandomSentence())
    return sentences.join(' ')
  }

  const handleGenerate = () => {
    try {
      let result = ''

      switch (type) {
        case 'paragraphs':
          const paragraphs = Array.from({ length: amount }, () => generateRandomParagraph())
          if (startWithLorem && paragraphs.length > 0) {
            paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + 
              paragraphs[0].split('. ').slice(1).join('. ')
          }
          result = paragraphs.join('\n\n')
          break

        case 'words':
          let words = Array.from({ length: amount }, generateRandomWord)
          if (startWithLorem) {
            words = ['Lorem', 'ipsum', ...words.slice(2)]
          }
          result = words.join(' ')
          break

        case 'bytes':
          let text = ''
          while (text.length < amount) {
            text += generateRandomParagraph() + ' '
          }
          result = text.slice(0, amount)
          break
      }

      setOutput(result)
      setToastMessage('Lorem Ipsum generated successfully!')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Error generating Lorem Ipsum')
      setShowToast(true)
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setType('paragraphs')}
          className={`flex-1 py-2 px-4 rounded-md ${
            type === 'paragraphs'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Paragraphs
        </button>
        <button
          onClick={() => setType('words')}
          className={`flex-1 py-2 px-4 rounded-md ${
            type === 'words'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Words
        </button>
        <button
          onClick={() => setType('bytes')}
          className={`flex-1 py-2 px-4 rounded-md ${
            type === 'bytes'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Bytes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount of {type}
          </label>
          <input
            type="number"
            min="1"
            max={type === 'bytes' ? 10000 : 100}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="startWithLorem"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="startWithLorem" className="ml-2 block text-sm text-gray-900">
            Start with "Lorem ipsum"
          </label>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Generate Lorem Ipsum
      </button>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Generated Text
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Copy
            </button>
          </div>
          <textarea
            rows={10}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={output}
            readOnly
          />
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