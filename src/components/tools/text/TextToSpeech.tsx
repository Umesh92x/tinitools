'use client'

import { useState, useEffect } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Voice {
  name: string
  lang: string
  voiceURI: string
}

export function TextToSpeech() {
  const [text, setText] = useState('')
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        const voiceList = availableVoices.map(voice => ({
          name: voice.name,
          lang: voice.lang,
          voiceURI: voice.voiceURI
        }))
        setVoices(voiceList)
        setSelectedVoice(voiceList[0].voiceURI)
      }
    }

    loadVoices()
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const handleSpeak = () => {
    if (!text) {
      setToastMessage('Please enter some text to speak')
      setShowToast(true)
      return
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const voice = voices.find(v => v.voiceURI === selectedVoice)
      if (voice) {
        utterance.voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === voice.voiceURI) || null
      }
      utterance.rate = rate
      utterance.pitch = pitch

      utterance.onstart = () => setIsPlaying(true)
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => {
        setIsPlaying(false)
        setToastMessage('Error occurred while playing speech')
        setShowToast(true)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          Enter Text
        </label>
        <textarea
          id="text"
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
            Voice
          </label>
          <select
            id="voice"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
            Speed: {rate}x
          </label>
          <input
            type="range"
            id="rate"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="pitch" className="block text-sm font-medium text-gray-700">
            Pitch: {pitch}
          </label>
          <input
            type="range"
            id="pitch"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="mt-1 block w-full"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSpeak}
          disabled={isPlaying}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPlaying ? 'Speaking...' : 'Speak'}
        </button>
        {isPlaying && (
          <button
            onClick={handleStop}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Stop
          </button>
        )}
      </div>

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type="error"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 