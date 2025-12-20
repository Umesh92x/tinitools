'use client'

import { useState, useEffect } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface TextStats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  lines: number
  uniqueWords: number
  longestWord: string
  averageWordLength: number
  readingTime: number
}

export function TextStatistics() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState<TextStats | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const calculateStats = () => {
    if (!text.trim()) {
      setStats(null)
      return
    }

    try {
      // Basic counts
      const characters = text.length
      const charactersNoSpaces = text.replace(/\s/g, '').length
      const words = text.trim().split(/\s+/).length
      const sentences = text.split(/[.!?]+/).filter(Boolean).length
      const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length
      const lines = text.split('\n').length

      // Unique words
      const wordList = text.toLowerCase().match(/\b\w+\b/g) || []
      const uniqueWords = new Set(wordList).size

      // Longest word
      const longestWord = wordList.reduce((longest, current) => 
        current.length > longest.length ? current : longest
      , '')

      // Average word length
      const totalWordLength = wordList.reduce((sum, word) => sum + word.length, 0)
      const averageWordLength = totalWordLength / wordList.length || 0

      // Reading time (assuming 200 words per minute)
      const readingTime = Math.ceil(words / 200)

      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        lines,
        uniqueWords,
        longestWord,
        averageWordLength,
        readingTime
      })

      setToastMessage('Text analysis completed!')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Error analyzing text')
      setShowToast(true)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(calculateStats, 500)
    return () => clearTimeout(debounceTimer)
  }, [text])

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
    } catch (err) {
      setToastMessage('Failed to paste from clipboard')
      setShowToast(true)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Enter Text
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
        />
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Basic Counts</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Characters:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.characters}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Characters (no spaces):</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.charactersNoSpaces}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Words:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.words}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Sentences:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.sentences}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Structure</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Paragraphs:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.paragraphs}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Lines:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.lines}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Unique Words:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.uniqueWords}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Reading Time:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.readingTime} min</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Word Analysis</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Longest Word:</dt>
                <dd className="text-sm font-medium text-gray-900">{stats.longestWord}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Average Word Length:</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {stats.averageWordLength.toFixed(1)} characters
                </dd>
              </div>
            </dl>
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