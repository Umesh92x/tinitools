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
  const [isPaused, setIsPaused] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)

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
      // Resume if paused
      if (isPaused && window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
        setIsPaused(false)
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const voice = voices.find(v => v.voiceURI === selectedVoice)
      if (voice) {
        utterance.voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === voice.voiceURI) || null
      }
      utterance.rate = rate
      utterance.pitch = pitch

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsPaused(false)
      }
      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentUtterance(null)
      }
      utterance.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setToastMessage('Error occurred while playing speech')
        setShowToast(true)
      }

      setCurrentUtterance(utterance)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handlePause = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        setIsPaused(true)
      }
    }
  }

  const handleResume = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
        setIsPaused(false)
      }
    }
  }

  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentUtterance(null)
    }
  }

  const setSpeedPreset = (preset: 'slow' | 'normal' | 'fast') => {
    switch (preset) {
      case 'slow':
        setRate(0.75)
        break
      case 'normal':
        setRate(1)
        break
      case 'fast':
        setRate(1.5)
        break
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
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
              Speed: {rate}x
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => setSpeedPreset('slow')}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Slow
              </button>
              <button
                onClick={() => setSpeedPreset('normal')}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Normal
              </button>
              <button
                onClick={() => setSpeedPreset('fast')}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Fast
              </button>
            </div>
          </div>
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

      <div className="flex space-x-2">
        <button
          onClick={handleSpeak}
          disabled={isPlaying && !isPaused}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isPaused ? 'Resume' : isPlaying ? 'Speaking...' : 'Speak'}
        </button>
        {isPlaying && !isPaused && (
          <button
            onClick={handlePause}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Pause
          </button>
        )}
        {isPaused && (
          <button
            onClick={handleResume}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Resume
          </button>
        )}
        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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