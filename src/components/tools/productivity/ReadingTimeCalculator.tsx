'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { ClockIcon, BookOpenIcon, UploadIcon, DownloadIcon, CopyIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface ReadingStats {
  words: number
  characters: number
  charactersNoSpaces: number
  sentences: number
  paragraphs: number
  readingTime: number
  readingTimeSlow: number
  readingTimeFast: number
}

const readingSpeedPresets = {
  slow: 150, // Slow reader
  average: 250, // Average adult
  fast: 350, // Fast reader
  veryFast: 450, // Very fast reader
}

export function ReadingTimeCalculator() {
  const [text, setText] = useState('')
  const [wordsPerMinute, setWordsPerMinute] = useState(250)
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const calculateStats = useCallback((text: string) => {
    if (!text.trim()) {
      setStats(null)
      return
    }

    const words = text.trim().split(/\s+/).filter(Boolean).length
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const sentences = text.split(/[.!?]+/).filter(Boolean).length
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length
    const readingTime = Math.ceil(words / wordsPerMinute)
    const readingTimeSlow = Math.ceil(words / readingSpeedPresets.slow)
    const readingTimeFast = Math.ceil(words / readingSpeedPresets.fast)

    setStats({
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      readingTimeSlow,
      readingTimeFast,
    })
  }, [wordsPerMinute])

  useEffect(() => {
    calculateStats(text)
  }, [text, calculateStats])

  const handleFileImport = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      const fileContent = await file.text()
      setText(fileContent)
      showMessage('File loaded successfully!')
    } catch (error) {
      showMessage('Error reading file', 'error')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileImport,
    accept: { 'text/plain': ['.txt'], 'text/markdown': ['.md'] },
    multiple: false,
    noClick: true,
  })

  const handleBrowseClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.md'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileImport([file])
    }
    input.click()
  }

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return 'Less than a minute'
    }
    if (minutes === 1) {
      return '1 minute'
    }
    if (minutes < 60) {
      return `${minutes} minutes`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (mins === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
    }
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${mins} ${mins === 1 ? 'minute' : 'minutes'}`
  }

  const copyStats = () => {
    if (!stats) return
    const statsText = `Reading Statistics:
Words: ${stats.words}
Characters: ${stats.characters}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time (${wordsPerMinute} WPM): ${formatTime(stats.readingTime)}`
    navigator.clipboard.writeText(statsText)
    showMessage('Statistics copied to clipboard!')
  }

  const exportStats = () => {
    if (!stats) return
    const statsText = `Reading Time Calculator - Results

Text Statistics:
- Words: ${stats.words.toLocaleString()}
- Characters: ${stats.characters.toLocaleString()}
- Characters (no spaces): ${stats.charactersNoSpaces.toLocaleString()}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}

Reading Time Estimates:
- Slow (150 WPM): ${formatTime(stats.readingTimeSlow)}
- Average (${wordsPerMinute} WPM): ${formatTime(stats.readingTime)}
- Fast (350 WPM): ${formatTime(stats.readingTimeFast)}

Text Preview:
${text.substring(0, 500)}${text.length > 500 ? '...' : ''}
`
    const blob = new Blob([statsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reading-stats-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('Statistics exported!')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div {...getRootProps()} className="w-full">
            <input {...getInputProps()} />
            <button
              type="button"
              onClick={handleBrowseClick}
              className="w-full mb-4 text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-300 rounded-md px-3 py-2 hover:bg-indigo-50 transition-colors"
            >
              📄 Import Text File
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Speed (words per minute)
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={wordsPerMinute}
                  onChange={(e) => setWordsPerMinute(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>100 WPM</span>
                  <span className="font-medium text-indigo-600">{wordsPerMinute} WPM</span>
                  <span>500 WPM</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setWordsPerMinute(readingSpeedPresets.slow)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Slow (150)
                  </button>
                  <button
                    onClick={() => setWordsPerMinute(readingSpeedPresets.average)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Average (250)
                  </button>
                  <button
                    onClick={() => setWordsPerMinute(readingSpeedPresets.fast)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Fast (350)
                  </button>
                  <button
                    onClick={() => setWordsPerMinute(readingSpeedPresets.veryFast)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Very Fast (450)
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here or import a file..."
                rows={15}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {text && (
                <p className="mt-1 text-xs text-gray-500">
                  {text.length} character{text.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {stats ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Reading Statistics</h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyStats}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                    title="Copy stats"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={exportStats}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                    title="Export stats"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="h-5 w-5 text-indigo-600" />
                    <h4 className="font-medium text-indigo-900">Reading Time</h4>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {formatTime(stats.readingTime)}
                  </p>
                  <p className="text-xs text-indigo-700 mt-1">
                    At {wordsPerMinute} words per minute
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-600">Slow (150 WPM)</div>
                    <div className="font-semibold text-gray-900">{formatTime(stats.readingTimeSlow)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-gray-600">Fast (350 WPM)</div>
                    <div className="font-semibold text-gray-900">{formatTime(stats.readingTimeFast)}</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpenIcon className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Text Statistics</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-600">Words</div>
                      <div className="font-semibold text-gray-900">{stats.words.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Characters</div>
                      <div className="font-semibold text-gray-900">{stats.characters.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">No Spaces</div>
                      <div className="font-semibold text-gray-900">{stats.charactersNoSpaces.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Sentences</div>
                      <div className="font-semibold text-gray-900">{stats.sentences}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-600">Paragraphs</div>
                      <div className="font-semibold text-gray-900">{stats.paragraphs}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Enter or import text to see reading statistics</p>
            </div>
          )}
        </div>
      </div>

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
