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
  readabilityScore: number
  readabilityLevel: string
  wordLengthDistribution: { length: number; count: number }[]
  topWords: { word: string; count: number }[]
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

      // Flesch Reading Ease Score
      const avgSentenceLength = words / sentences || 0
      const avgSyllablesPerWord = 1.5 // Approximation
      const readabilityScore = Math.max(0, Math.min(100, 
        206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
      ))
      
      let readabilityLevel = 'Very Easy'
      if (readabilityScore < 30) readabilityLevel = 'Very Difficult'
      else if (readabilityScore < 50) readabilityLevel = 'Difficult'
      else if (readabilityScore < 60) readabilityLevel = 'Fairly Difficult'
      else if (readabilityScore < 70) readabilityLevel = 'Standard'
      else if (readabilityScore < 80) readabilityLevel = 'Fairly Easy'
      else if (readabilityScore < 90) readabilityLevel = 'Easy'

      // Word length distribution
      const wordLengths: { [key: number]: number } = {}
      wordList.forEach(word => {
        const len = word.length
        wordLengths[len] = (wordLengths[len] || 0) + 1
      })
      const wordLengthDistribution = Object.entries(wordLengths)
        .map(([length, count]) => ({ length: parseInt(length), count: count as number }))
        .sort((a, b) => a.length - b.length)
        .slice(0, 10) // Top 10 lengths

      // Top words frequency
      const wordFreq: { [key: string]: number } = {}
      wordList.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      })
      const topWords = Object.entries(wordFreq)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10 words

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
        readingTime,
        readabilityScore,
        readabilityLevel,
        wordLengthDistribution,
        topWords
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
        <>
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
              <h3 className="text-lg font-medium text-gray-900">Readability</h3>
              <dl className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <dt className="text-sm text-gray-500">Score:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {stats.readabilityScore.toFixed(1)}/100
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Level:</dt>
                  <dd className={`text-sm font-medium ${
                    stats.readabilityScore >= 70 ? 'text-green-600' :
                    stats.readabilityScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {stats.readabilityLevel}
                  </dd>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        stats.readabilityScore >= 70 ? 'bg-green-500' :
                        stats.readabilityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stats.readabilityScore}%` }}
                    />
                  </div>
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

            {stats.wordLengthDistribution.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Word Length Distribution</h3>
                <div className="space-y-2">
                  {stats.wordLengthDistribution.map((item) => {
                    const maxCount = Math.max(...stats.wordLengthDistribution.map(d => d.count))
                    const percentage = (item.count / maxCount) * 100
                    return (
                      <div key={item.length} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-8">{item.length} chars:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                          <div
                            className="bg-indigo-500 h-4 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8">{item.count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {stats.topWords.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Top Words</h3>
                <div className="space-y-1">
                  {stats.topWords.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{item.word}</span>
                      <span className="text-sm font-medium text-gray-900">{item.count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const csv = `Metric,Value\nCharacters,${stats.characters}\nWords,${stats.words}\nSentences,${stats.sentences}\nReadability Score,${stats.readabilityScore.toFixed(1)}`
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'text-statistics.csv'
                a.click()
                setToastMessage('CSV exported!')
                setShowToast(true)
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                const json = JSON.stringify(stats, null, 2)
                const blob = new Blob([json], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'text-statistics.json'
                a.click()
                setToastMessage('JSON exported!')
                setShowToast(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export JSON
            </button>
          </div>
        </>
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