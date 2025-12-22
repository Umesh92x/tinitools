'use client'

import { useState, useEffect } from 'react'
import { Copy } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type GeneratorType = 'paragraphs' | 'words' | 'bytes'
type GeneratorStyle = 'lorem' | 'bacon' | 'hipster'

const LOREM_WORDS = `Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum`.split(' ')

const BACON_WORDS = `Bacon ipsum dolor amet pork belly brisket ribeye ham hock shankle turducken beef ribs kielbasa pork chop. Sirloin pork loin bresaola, beef ribs ball tip jerky biltong. Pork belly short ribs brisket, beef ribs ball tip jerky biltong.`.split(' ')

const HIPSTER_WORDS = `Vegan freegan locavore, ethical mixtape semiotics sustainable. Tote bag craft beer, aesthetic quinoa banh mi. PBR&B meditation, lomo leggings.`.split(' ')

const getWordsByStyle = (style: GeneratorStyle): string[] => {
  switch (style) {
    case 'bacon': return BACON_WORDS
    case 'hipster': return HIPSTER_WORDS
    default: return LOREM_WORDS
  }
}

export function LoremIpsumGenerator() {
  const [type, setType] = useState<GeneratorType>('paragraphs')
  const [style, setStyle] = useState<GeneratorStyle>('lorem')
  const [amount, setAmount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [output, setOutput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const generateRandomWord = () => {
    const words = getWordsByStyle(style)
    return words[Math.floor(Math.random() * words.length)]
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
          if (startWithLorem && paragraphs.length > 0 && style === 'lorem') {
            paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + 
              paragraphs[0].split('. ').slice(1).join('. ')
          } else if (startWithLorem && paragraphs.length > 0 && style === 'bacon') {
            paragraphs[0] = 'Bacon ipsum dolor amet pork belly brisket ribeye. ' + 
              paragraphs[0].split('. ').slice(1).join('. ')
          } else if (startWithLorem && paragraphs.length > 0 && style === 'hipster') {
            paragraphs[0] = 'Vegan freegan locavore, ethical mixtape semiotics sustainable. ' + 
              paragraphs[0].split('. ').slice(1).join('. ')
          }
          result = paragraphs.join('\n\n')
          break

        case 'words':
          let words = Array.from({ length: amount }, generateRandomWord)
          if (startWithLorem && style === 'lorem') {
            words = ['Lorem', 'ipsum', ...words.slice(2)]
          } else if (startWithLorem && style === 'bacon') {
            words = ['Bacon', 'ipsum', ...words.slice(2)]
          } else if (startWithLorem && style === 'hipster') {
            words = ['Vegan', 'freegan', ...words.slice(2)]
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

  // Auto-generate on mount
  useEffect(() => {
    handleGenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generator Style
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => setStyle('lorem')}
            className={`flex-1 py-2 px-4 rounded-md text-sm ${
              style === 'lorem'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lorem Ipsum
          </button>
          <button
            onClick={() => setStyle('bacon')}
            className={`flex-1 py-2 px-4 rounded-md text-sm ${
              style === 'bacon'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bacon Ipsum
          </button>
          <button
            onClick={() => setStyle('hipster')}
            className={`flex-1 py-2 px-4 rounded-md text-sm ${
              style === 'hipster'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hipster Ipsum
          </button>
        </div>
      </div>

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
            {style === 'lorem' ? 'Start with "Lorem ipsum"' : 
             style === 'bacon' ? 'Start with "Bacon ipsum"' : 
             'Start with "Vegan freegan"'}
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
              Generated Text ({style === 'lorem' ? 'Lorem Ipsum' : style === 'bacon' ? 'Bacon Ipsum' : 'Hipster Ipsum'})
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
          <textarea
            rows={10}
            className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500"
            value={output}
            readOnly
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                const html = output.split('\n\n').map(p => `<p>${p}</p>`).join('\n')
                navigator.clipboard.writeText(html)
                setToastMessage('HTML copied!')
                setShowToast(true)
              }}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Copy as HTML
            </button>
            <button
              onClick={() => {
                const markdown = output.split('\n\n').map(p => p).join('\n\n')
                navigator.clipboard.writeText(markdown)
                setToastMessage('Markdown copied!')
                setShowToast(true)
              }}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Copy as Markdown
            </button>
          </div>
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