'use client'

import { useState, useEffect } from 'react'
import { Copy, Download, Upload, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Sanscript from '@indic-transliteration/sanscript'

// Preprocess input to handle common cases where users omit long vowel markers
// This makes the transliteration more lenient and user-friendly
function preprocessInput(text: string): string {
  if (!text.trim()) return text
  
  // Process word by word, but preserve all characters including spaces
  // Use word boundaries to identify complete words
  return text.replace(/\b([a-zA-Z]+)\b/g, (match, word) => {
    // Only process alphabetic words
    if (!/^[a-zA-Z]+$/.test(word)) return match
  
  const originalWord = word
    let processed = word.toLowerCase()
    
    // Handle "type" → "Taip" (retroflex T for ट)
    if (processed === 'type') {
      return 'Taip'
    }
    
    // Handle "ane" at end of word (like "jane" → "jaane" for जाने)
    // Pattern: consonant + a + n + e → consonant + aa + n + e
    processed = processed.replace(/([bcdfghjklmnpqrstvwxyz])ane$/i, '$1aane')
    
    // Handle "are" at end of word (like "kare" → "kaare" for करे)
    processed = processed.replace(/([bcdfghjklmnpqrstvwxyz])are$/i, '$1aare')
    
    // Handle "aha" patterns (like "yaha" → "yahaa" for यहाँ)
    processed = processed.replace(/([bcdfghjklmnpqrstvwxyz])aha$/i, '$1ahaa')
    
    // Handle specific common words
    if (processed === 'yaha') processed = 'yahaa'
    if (processed === 'waha') processed = 'wahaa'
    
    // Preserve original case for first letter if it was capitalized
    if (originalWord[0] === originalWord[0].toUpperCase()) {
      processed = processed.charAt(0).toUpperCase() + processed.slice(1)
    }
    
    return processed
  })
}

// Transliteration function using sanscript library
function transliterateToHindi(text: string): string {
  if (!text.trim()) return ''
  
  try {
    // Preprocess to handle common lenient cases
    const preprocessed = preprocessInput(text)
    
    // Use sanscript to transliterate from ITRANS (phonetic English) to Devanagari
    // ITRANS is a popular transliteration scheme for Indian languages
    // The library handles spaces and punctuation automatically
    const transliterated = Sanscript.t(preprocessed, 'itrans', 'devanagari')
    
    // Ensure we return something - if transliteration returns empty, return original
    return transliterated || text
  } catch (error) {
    // Fallback: return original text if transliteration fails
    console.error('Transliteration error:', error)
    return text
  }
}

export function PhoneticTyping() {
  const [englishInput, setEnglishInput] = useState('')
  const [output, setOutput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState<'hindi'>('hindi')

  // Real-time transliteration
  useEffect(() => {
    if (englishInput.trim()) {
      const transliterated = transliterateToHindi(englishInput)
      setOutput(transliterated)
    } else {
      setOutput('')
    }
  }, [englishInput, language])

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToastMessage(`${label} copied to clipboard!`)
      setShowToast(true)
    } catch (err) {
      setToastMessage('Failed to copy to clipboard')
      setShowToast(true)
    }
  }

  const handleDownload = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transliterated-text.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setToastMessage('File downloaded successfully!')
    setShowToast(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setEnglishInput(text)
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    setEnglishInput('')
    setOutput('')
  }

  const handleSpeak = () => {
    if (!output) return
    
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(output)
      utterance.lang = language === 'hindi' ? 'hi-IN' : 'hi-IN'
      utterance.rate = 0.9
      utterance.pitch = 1
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => {
        setIsSpeaking(false)
        setToastMessage('Speech synthesis not available')
        setShowToast(true)
      }
      
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    } else {
      setToastMessage('Speech synthesis not supported in your browser')
      setShowToast(true)
    }
  }

  const loadExample = () => {
    setEnglishInput('namaste, main kaise hoon? dhanyavaad')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* English Input */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Type in English</h3>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleClear}
                className="text-gray-500 hover:text-gray-700"
                title="Clear"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Textarea
            value={englishInput}
            onChange={(e) => setEnglishInput(e.target.value)}
            placeholder="Type in English using phonetic transliteration (e.g., namaste, dhanyavaad)..."
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{englishInput.length} characters</span>
            <button
              onClick={loadExample}
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              Load example
            </button>
          </div>
        </Card>

        {/* Hindi Output */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Output</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleSpeak()}
                className={`text-gray-500 hover:text-gray-700 ${isSpeaking ? 'text-indigo-600' : ''}`}
                title="Speak"
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleCopy(output, 'Transliterated text')}
                disabled={!output}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="Copy"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="min-h-[200px] p-3 border border-gray-200 rounded-md bg-gray-50 font-sans text-lg leading-relaxed">
            {output || (
              <span className="text-gray-400">Transliterated text will appear here...</span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {output.length} characters
          </div>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="p-6 bg-indigo-50 border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Type phonetically:</strong> Type English words as they sound in Hindi using ITRANS transliteration scheme. Currently supports Hindi (Devanagari script).
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="font-semibold mb-2">Common Words (Hindi):</p>
              <ul className="space-y-1 text-xs">
                <li>namaste → नमस्ते</li>
                <li>dhanyavaad → धन्यवाद</li>
                <li>kripayaa → कृपया</li>
                <li>haan → हाँ</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Vowels (ITRANS):</p>
              <ul className="space-y-1 text-xs">
                <li>a → अ, aa/A → आ</li>
                <li>i → इ, ii/I → ई</li>
                <li>u → उ, uu/U → ऊ</li>
                <li>e → ए, ai → ऐ</li>
                <li>o → ओ, au → औ</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            <strong>Note:</strong> Uses ITRANS transliteration scheme. For retroflex consonants, use capital letters: T, D, N for ट, ड, ण.
          </p>
        </div>
      </Card>

      {/* Special Characters */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Characters</h3>
        <div className="flex flex-wrap gap-2">
          {['।', '॥', '॰', 'ॐ', 'ं', 'ः', 'ँ'].map((char) => (
            <button
              key={char}
              onClick={() => setEnglishInput(prev => prev + char)}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-lg"
            >
              {char}
            </button>
          ))}
        </div>
      </Card>

      <Toast
        show={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

