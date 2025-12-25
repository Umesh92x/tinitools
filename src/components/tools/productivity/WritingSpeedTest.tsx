'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { RefreshCw, Play, Square, Timer, AlertCircle, TrendingUpIcon, BarChartIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

const sampleTexts = {
  short: [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.`,
    `Programming is the art of telling another human what one wants the computer to do. It requires both technical skill and creativity.`,
    `Success is not final, failure is not fatal: it is the courage to continue that counts. Keep practicing to improve your skills.`
  ],
  medium: [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. As the sun sets on the horizon, casting long shadows across the peaceful meadow, a gentle breeze rustles through the leaves.`,
    `In a world of digital transformation, typing speed has become an essential skill for productivity and efficiency. From sending emails to writing code, our fingers dance across keyboards daily, translating thoughts into text.`,
    `Programming is the art of telling another human what one wants the computer to do. It requires both technical skill and creativity. As developers, we spend countless hours crafting elegant solutions to complex problems.`
  ],
  long: [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. As the sun sets on the horizon, casting long shadows across the peaceful meadow, a gentle breeze rustles through the leaves. The world seems to slow down in these moments, allowing us to appreciate the simple beauty of nature. In these quiet times, we find our thoughts wandering to distant places and dreams yet to be realized.`,
    `In a world of digital transformation, typing speed has become an essential skill for productivity and efficiency. From sending emails to writing code, our fingers dance across keyboards daily, translating thoughts into text at remarkable speeds. The modern workplace demands not just accuracy, but also velocity in our digital communications. As technology continues to evolve, our ability to keep pace with these changes becomes increasingly important.`,
    `Programming is the art of telling another human what one wants the computer to do. It requires both technical skill and creativity. As developers, we spend countless hours crafting elegant solutions to complex problems, writing code that must be both efficient and maintainable. The best programs are those that can be easily understood by others, with clear documentation and logical structure.`
  ]
}

interface TestStats {
  wpm: number
  errors: number
  accuracy: number
  time: number
  rating: string
  feedback: string
  date: string
}

const speedRatings = [
  { min: 0, max: 20, rating: 'Beginner', feedback: 'Keep practicing! Regular practice will help improve your speed.' },
  { min: 21, max: 40, rating: 'Average', feedback: 'You\'re doing well! Keep practicing to improve further.' },
  { min: 41, max: 60, rating: 'Good', feedback: 'Great typing speed! You\'re above average.' },
  { min: 61, max: 80, rating: 'Professional', feedback: 'Excellent! You have professional-level typing speed.' },
  { min: 81, max: Infinity, rating: 'Expert', feedback: 'Outstanding! You\'re among the fastest typists!' },
]

export function WritingSpeedTest() {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [stats, setStats] = useState<TestStats | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [currentErrors, setCurrentErrors] = useState(0)
  const [textLength, setTextLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [testHistory, setTestHistory] = useState<TestStats[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const getRandomText = useCallback(() => {
    const textsForLength = sampleTexts[textLength]
    const randomIndex = Math.floor(Math.random() * textsForLength.length)
    return textsForLength[randomIndex]
  }, [textLength])

  const resetTest = useCallback(() => {
    setText(getRandomText())
    setUserInput('')
    setIsStarted(false)
    setStartTime(null)
    setStats(null)
    setElapsedTime(0)
    setCurrentCharIndex(0)
    setCurrentErrors(0)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [getRandomText])

  useEffect(() => {
    resetTest()
  }, [resetTest])

  useEffect(() => {
    const savedHistory = localStorage.getItem('typingTestHistory')
    if (savedHistory) {
      try {
        setTestHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Error loading history:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (testHistory.length > 0) {
      try {
        localStorage.setItem('typingTestHistory', JSON.stringify(testHistory))
      } catch (error) {
        console.error('Error saving history:', error)
      }
    }
  }, [testHistory])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isStarted && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isStarted, startTime])

  const getRating = (wpm: number): { rating: string; feedback: string } => {
    const rating = speedRatings.find(r => wpm >= r.min && (!r.max || wpm <= r.max))
    return rating || speedRatings[0]
  }

  const calculateStats = () => {
    if (!startTime) return

    const endTime = Date.now()
    const timeInMinutes = (endTime - startTime) / 60000
    const words = text.trim().split(/\s+/).length
    const wpm = Math.round(words / timeInMinutes)
    const accuracy = Math.round(((text.length - currentErrors) / text.length) * 100)

    const { rating, feedback } = getRating(wpm)

    const testStats: TestStats = {
      wpm,
      errors: currentErrors,
      accuracy,
      time: Math.round(timeInMinutes * 60),
      rating,
      feedback,
      date: new Date().toISOString(),
    }

    setStats(testStats)
    setTestHistory(prev => [testStats, ...prev].slice(0, 50)) // Keep last 50 tests
    showMessage('Test completed! Check your results below.')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    
    if (!isStarted && value) {
      setIsStarted(true)
      setStartTime(Date.now())
    }

    // Count mismatched characters as errors
    let errors = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errors++
      }
    }
    setCurrentErrors(errors)
    setCurrentCharIndex(value.length)
    setUserInput(value)

    // Complete the test when the input length matches the text length
    if (value.length === text.length) {
      calculateStats()
      setIsStarted(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600'
    if (accuracy >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const averageWPM = testHistory.length > 0
    ? Math.round(testHistory.reduce((sum, test) => sum + test.wpm, 0) / testHistory.length)
    : 0

  const bestWPM = testHistory.length > 0
    ? Math.max(...testHistory.map(test => test.wpm))
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Sample Text</h3>
              <div className="flex items-center gap-4">
                <select
                  value={textLength}
                  onChange={(e) => {
                    setTextLength(e.target.value as 'short' | 'medium' | 'long')
                    resetTest()
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
                {isStarted && (
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Timer className="w-4 h-4" />
                    <span className="font-medium">{formatTime(elapsedTime)}</span>
                  </div>
                )}
                <button
                  onClick={resetTest}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Text
                </button>
              </div>
            </div>
            <div className="text-lg leading-relaxed p-4 bg-gray-50 rounded-lg font-mono">
              {text.split('').map((char, index) => {
                let className = ''
                if (index < currentCharIndex) {
                  className = userInput[index] === char ? 'text-green-600' : 'text-red-600 bg-red-50'
                } else if (index === currentCharIndex) {
                  className = 'bg-indigo-200'
                }
                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                )
              })}
            </div>
            {!isStarted && !stats && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Start typing to begin the test. The timer will start automatically.</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {isStarted ? (
                  <Square className="w-5 h-5 text-red-600 animate-pulse" />
                ) : (
                  <Play className="w-5 h-5 text-indigo-600" />
                )}
                <h3 className="font-medium text-gray-900">
                  {isStarted ? 'Test in Progress...' : 'Start Typing'}
                </h3>
              </div>
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={handleInputChange}
                placeholder="Start typing here..."
                disabled={!!stats}
                rows={6}
                className="w-full p-4 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {stats && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Speed (WPM)</h4>
                  <p className="text-3xl font-bold text-indigo-600">{stats.wpm}</p>
                </div>
                <div className={`text-center p-4 rounded-lg ${getAccuracyColor(stats.accuracy)} bg-opacity-10`}>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Accuracy</h4>
                  <p className="text-3xl font-bold">{stats.accuracy}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Errors</h4>
                  <p className="text-3xl font-bold text-red-600">{stats.errors}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Time</h4>
                  <p className="text-3xl font-bold">{stats.time}s</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Your Rating: {stats.rating}</h4>
                <p className="text-sm text-gray-600">{stats.feedback}</p>
              </div>

              <button
                onClick={resetTest}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          )}

          {testHistory.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChartIcon className="h-5 w-5" />
                  Statistics
                </h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  {showHistory ? 'Hide' : 'Show'} History
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Average WPM</div>
                  <div className="text-2xl font-bold text-blue-600">{averageWPM}</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Best WPM</div>
                  <div className="text-2xl font-bold text-green-600">{bestWPM}</div>
                </div>
              </div>

              {showHistory && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {testHistory.slice(0, 10).map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <div>
                        <span className="font-medium">{test.wpm} WPM</span>
                        <span className="text-gray-600 ml-2">• {test.accuracy}% accuracy</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(test.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
