'use client'

import { useState, useEffect } from 'react'
import { Copy, Download, Upload, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

// Consonant mappings
const consonants: Record<string, string> = {
  'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ng': 'ङ',
  'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ', 'ny': 'ञ',
  't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
  'T': 'ट', 'Th': 'ठ', 'D': 'ड', 'Dh': 'ढ', 'N': 'ण',
  'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
  'y': 'य', 'r': 'र', 'l': 'ल', 'v': 'व', 'w': 'व',
  'sh': 'श', 'Sh': 'ष', 's': 'स', 'h': 'ह',
  'x': 'क्ष', 'ksh': 'क्ष',
}

// Vowel matras (diacritics)
const matras: Record<string, string> = {
  'a': '', 'aa': 'ा', 'i': 'ि', 'ee': 'ी', 'ii': 'ी',
  'u': 'ु', 'oo': 'ू', 'uu': 'ू', 'e': 'े', 'ai': 'ै',
  'o': 'ो', 'au': 'ौ', 'ou': 'ौ', 'am': 'ं', 'aha': 'ः',
  'an': 'ं', 'ah': 'ः',
}

// Standalone vowels
const vowels: Record<string, string> = {
  'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'ii': 'ई',
  'u': 'उ', 'oo': 'ऊ', 'uu': 'ऊ', 'e': 'ए', 'ai': 'ऐ',
  'o': 'ओ', 'au': 'औ', 'ou': 'औ', 'am': 'अं', 'aha': 'अः',
  'an': 'अं', 'ah': 'अः',
}

// Common word mappings (including English words commonly used in Hindi)
const wordMap: Record<string, string> = {
  // Hindi words
  'namaste': 'नमस्ते', 'dhanyavaad': 'धन्यवाद', 'dhanyavad': 'धन्यवाद',
  'kripaya': 'कृपया', 'haan': 'हाँ', 'nahi': 'नहीं', 'naheen': 'नहीं',
  'shayad': 'शायद', 'swagat': 'स्वागत', 'maaf': 'माफ़',
  'kshama': 'क्षमा', 'main': 'मैं', 'tum': 'तुम', 'aap': 'आप',
  'hum': 'हम', 'kaise': 'कैसे', 'kya': 'क्या', 'kab': 'कब',
  'kahan': 'कहाँ', 'kyon': 'क्यों', 'kaun': 'कौन', 'kitna': 'कितना',
  'yaha': 'यहाँ', 'yahaan': 'यहाँ', 'waha': 'वहाँ', 'wahaan': 'वहाँ',
  'kare': 'करे', 'karo': 'करो', 'kar': 'कर', 'karna': 'करना',
  
  // English words commonly used in Hindi
  'type': 'टाइप', 'phone': 'फोन', 'computer': 'कंप्यूटर',
  'internet': 'इंटरनेट', 'email': 'ईमेल', 'message': 'मैसेज',
  'video': 'वीडियो', 'photo': 'फोटो', 'music': 'म्यूजिक',
}

// Special characters and numbers
const specialChars: Record<string, string> = {
  '.': '।', ',': ',', '?': '?', '!': '!', ':': ':', ';': ';',
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
}

// Helper function to check if a character is a vowel
function isVowel(char: string): boolean {
  return /[aeiouAEIOU]/.test(char)
}

// Helper function to get consonant-vowel combination
function getConsonantVowel(word: string, start: number): { consonant: string; vowel: string; length: number; hasH?: boolean } | null {
  if (start >= word.length) return null
  
  const originalWord = word
  const lowerWord = word.toLowerCase()
  let i = start
  let consonant = ''
  let vowel = ''
  let hasH = false
  
  // Check for capital T, D, N (retroflex)
  const isRetroflex = originalWord[i] === 'T' || originalWord[i] === 'D' || originalWord[i] === 'N'
  
  // Try to match consonant clusters first (longest first)
  const consonantPatterns = ['ksh', 'chh', 'Th', 'Dh', 'kh', 'gh', 'ch', 'jh', 'dh', 'bh', 'ph', 'sh', 'Sh']
  for (const pattern of consonantPatterns) {
    if (lowerWord.substring(i).startsWith(pattern)) {
      consonant = pattern
      i += pattern.length
      break
    }
  }
  
  // If no cluster matched, try single consonant
  if (!consonant && i < word.length) {
    const char = originalWord[i]
    const lowerChar = char.toLowerCase()
    
    // Handle retroflex consonants (capital T, D, N)
    if (isRetroflex) {
      consonant = char
      i++
    } else if (consonants[lowerChar] || /[bcdfghjklmnpqrstvwxyz]/.test(lowerChar)) {
      consonant = lowerChar
      i++
    }
  }
  
  // Check for 'h' after vowel (like in "yaha" -> "यहाँ")
  if (i < word.length && lowerWord[i] === 'h' && consonant) {
    // Check if next character is a vowel
    if (i + 1 < word.length && isVowel(lowerWord[i + 1])) {
      hasH = true
      i++ // Skip 'h', it will be handled by the vowel matra
    }
  }
  
  // Now try to match vowel patterns (longest first)
  if (i < word.length) {
    const vowelPatterns = ['aha', 'aha', 'au', 'ou', 'ai', 'ee', 'ii', 'oo', 'uu', 'aa', 'am', 'an', 'ah']
    for (const pattern of vowelPatterns) {
      if (lowerWord.substring(i).startsWith(pattern)) {
        vowel = pattern
        i += pattern.length
        break
      }
    }
    
    // If no vowel pattern matched, try single vowel
    if (!vowel && i < word.length) {
      const char = lowerWord[i]
      if (isVowel(char)) {
        vowel = char
        i++
      }
    }
  }
  
  // If we have a consonant but no vowel, default to 'a'
  if (consonant && !vowel) {
    vowel = 'a'
  }
  
  if (consonant || vowel) {
    return {
      consonant: consonant || '',
      vowel: vowel || '',
      length: i - start,
      hasH: hasH
    }
  }
  
  return null
}

// Process a single word for transliteration
function transliterateWord(word: string): string {
  if (!word) return ''
  
  // Remove any trailing punctuation for lookup
  const cleanWord = word.replace(/[.,!?;:]+$/, '')
  const lowerWord = cleanWord.toLowerCase()
  
  // Check word map first (exact match)
  if (wordMap[lowerWord]) {
    // Add back any trailing punctuation
    const punct = word.substring(cleanWord.length)
    return wordMap[lowerWord] + punct
  }
  
  // Process the clean word (without punctuation)
  let result = ''
  let i = 0
  const processWord = cleanWord.toLowerCase()
  
  while (i < cleanWord.length) {
    const char = cleanWord[i]
    const lowerChar = char.toLowerCase()
    
    // Try to match patterns from longest to shortest
    let matched = false
    
    // Try 4-character patterns first
    if (i + 4 <= cleanWord.length) {
      const pattern = processWord.substring(i, i + 4)
      // Handle special cases like "type" -> "टाइप"
      if (pattern === 'type') {
        result += 'टाइप'
        i += 4
        matched = true
      }
    }
    
    // Try 3-character patterns
    if (!matched && i + 3 <= cleanWord.length) {
      const pattern = processWord.substring(i, i + 3)
      const cv = getConsonantVowel(cleanWord, i)
      if (cv && cv.length >= 3) {
        // Process the CV combination
        if (cv.consonant) {
          let cons = consonants[cv.consonant] || consonants[cv.consonant.toLowerCase()]
          if (cons) {
            let matra = matras[cv.vowel] || ''
            result += cons + matra
            i += cv.length
            matched = true
          }
        }
      }
    }
    
    // Try 2-character patterns (consonant clusters or CV)
    if (!matched && i + 2 <= cleanWord.length) {
      const pattern = processWord.substring(i, i + 2)
      
      // Check for consonant clusters
      if (consonants[pattern]) {
        // Check if next char is a vowel
        if (i + 2 < cleanWord.length && isVowel(processWord[i + 2])) {
          const vowel = processWord[i + 2]
          const matra = matras[vowel] || ''
          result += consonants[pattern] + matra
          i += 3
          matched = true
        } else {
          // Consonant cluster with implicit 'a'
          result += consonants[pattern]
          i += 2
          matched = true
        }
      } else {
        // Try CV combination
        const cv = getConsonantVowel(cleanWord, i)
        if (cv && cv.length === 2) {
          if (cv.consonant) {
            let cons = consonants[cv.consonant] || consonants[cv.consonant.toLowerCase()]
            if (cons) {
              let matra = matras[cv.vowel] || ''
              result += cons + matra
              i += 2
              matched = true
            }
          } else if (cv.vowel) {
            const vowelChar = vowels[cv.vowel] || vowels[cv.vowel.toLowerCase()]
            if (vowelChar) {
              result += vowelChar
              i += 2
              matched = true
            }
          }
        }
      }
    }
    
    // Try single character
    if (!matched) {
      // Handle retroflex (capital T, D, N)
      if (char === 'T') {
        if (i + 1 < cleanWord.length && isVowel(processWord[i + 1])) {
          const vowel = processWord[i + 1]
          const matra = matras[vowel] || ''
          result += consonants['T'] + matra
          i += 2
        } else {
          result += consonants['T']
          i++
        }
        matched = true
      } else if (char === 'D') {
        if (i + 1 < cleanWord.length && isVowel(processWord[i + 1])) {
          const vowel = processWord[i + 1]
          const matra = matras[vowel] || ''
          result += consonants['D'] + matra
          i += 2
        } else {
          result += consonants['D']
          i++
        }
        matched = true
      } else if (char === 'N') {
        if (i + 1 < cleanWord.length && isVowel(processWord[i + 1])) {
          const vowel = processWord[i + 1]
          const matra = matras[vowel] || ''
          result += consonants['N'] + matra
          i += 2
        } else {
          result += consonants['N']
          i++
        }
        matched = true
      } else if (consonants[lowerChar]) {
        // Single consonant
        if (i + 1 < cleanWord.length && isVowel(processWord[i + 1])) {
          const vowel = processWord[i + 1]
          const matra = matras[vowel] || ''
          result += consonants[lowerChar] + matra
          i += 2
        } else {
          // Consonant with implicit 'a'
          result += consonants[lowerChar]
          i++
        }
        matched = true
      } else if (vowels[lowerChar]) {
        // Standalone vowel
        result += vowels[lowerChar]
        i++
        matched = true
      } else {
        // No match, keep original
        result += char
        i++
      }
    }
  }
  
  // Add back any trailing punctuation
  const punct = word.substring(cleanWord.length)
  return result + punct
}

function transliterateToHindi(text: string): string {
  if (!text.trim()) return ''
  
  const words = text.split(/\s+/)
  const result: string[] = []
  
  for (const word of words) {
    // Remove punctuation temporarily, process, then add back
    const punctuationMatch = word.match(/^([a-zA-Z]*)([^a-zA-Z]*)$/)
    if (punctuationMatch) {
      const [, wordPart, punctPart] = punctuationMatch
      const transliterated = transliterateWord(wordPart)
      result.push(transliterated + punctPart)
    } else {
      result.push(transliterateWord(word))
    }
  }
  
  return result.join(' ')
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
            <strong>Type phonetically:</strong> Type English words as they sound in the target language. Currently supports Hindi (Devanagari script).
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="font-semibold mb-2">Common Words (Hindi):</p>
              <ul className="space-y-1 text-xs">
                <li>namaste → नमस्ते</li>
                <li>dhanyavaad → धन्यवाद</li>
                <li>kripaya → कृपया</li>
                <li>haan → हाँ</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Vowels:</p>
              <ul className="space-y-1 text-xs">
                <li>a → अ, aa → आ</li>
                <li>i → इ, ee → ई</li>
                <li>u → उ, oo → ऊ</li>
                <li>e → ए, ai → ऐ</li>
              </ul>
            </div>
          </div>
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

