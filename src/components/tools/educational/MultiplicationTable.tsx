'use client'

import { useState, useEffect } from 'react'
import { Printer, Download, RefreshCw, Play, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type Mode = 'table' | 'practice' | 'quiz'

interface QuizStats {
  correct: number
  incorrect: number
  total: number
  time: number
}

export function MultiplicationTable() {
  const [mode, setMode] = useState<Mode>('table')
  const [startNumber, setStartNumber] = useState(1)
  const [endNumber, setEndNumber] = useState(10)
  const [multiplier, setMultiplier] = useState(10)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  // Practice mode state
  const [practiceQuestion, setPracticeQuestion] = useState<{ a: number; b: number } | null>(null)
  const [practiceAnswer, setPracticeAnswer] = useState('')
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 })

  // Quiz mode state
  const [quizQuestions, setQuizQuestions] = useState<Array<{ a: number; b: number; answer: number; userAnswer: number | null }>>([])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null)
  const [quizTime, setQuizTime] = useState(0)
  const [quizTimer, setQuizTimer] = useState<NodeJS.Timeout | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const generatePracticeQuestion = () => {
    const a = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber
    const b = Math.floor(Math.random() * multiplier) + 1
    setPracticeQuestion({ a, b })
    setPracticeAnswer('')
  }

  const checkPracticeAnswer = () => {
    if (!practiceQuestion || !practiceAnswer) return
    
    const userAnswer = parseInt(practiceAnswer)
    const correctAnswer = practiceQuestion.a * practiceQuestion.b
    
    if (userAnswer === correctAnswer) {
      setPracticeScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }))
      showMessage('Correct! 🎉')
      setTimeout(() => {
        generatePracticeQuestion()
      }, 1000)
    } else {
      setPracticeScore(prev => ({ total: prev.total + 1 }))
      showMessage(`Incorrect. The answer is ${correctAnswer}`, 'error')
    }
    setPracticeAnswer('')
  }

  const startQuiz = () => {
    const questions: Array<{ a: number; b: number; answer: number; userAnswer: number | null }> = []
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * (endNumber - startNumber + 1)) + startNumber
      const b = Math.floor(Math.random() * multiplier) + 1
      questions.push({ a, b, answer: a * b, userAnswer: null })
    }
    setQuizQuestions(questions)
    setCurrentQuizIndex(0)
    setQuizAnswer('')
    setQuizStats(null)
    setQuizTime(0)
    
    const timer = setInterval(() => {
      setQuizTime(prev => prev + 1)
    }, 1000)
    setQuizTimer(timer)
  }

  const submitQuizAnswer = () => {
    if (!quizAnswer) return
    
    const userAnswer = parseInt(quizAnswer)
    const updatedQuestions = [...quizQuestions]
    updatedQuestions[currentQuizIndex].userAnswer = userAnswer
    setQuizQuestions(updatedQuestions)
    
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
      setQuizAnswer('')
    } else {
      finishQuiz(updatedQuestions)
    }
  }

  const finishQuiz = (questions: typeof quizQuestions) => {
    if (quizTimer) {
      clearInterval(quizTimer)
      setQuizTimer(null)
    }
    
    const correct = questions.filter(q => q.userAnswer === q.answer).length
    const incorrect = questions.length - correct
    
    setQuizStats({
      correct,
      incorrect,
      total: questions.length,
      time: quizTime,
    })
    showMessage('Quiz completed!')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    let content = 'Multiplication Table\n\n'
    for (let i = startNumber; i <= endNumber; i++) {
      content += `Table of ${i}:\n`
      for (let j = 1; j <= multiplier; j++) {
        content += `${i} × ${j} = ${i * j}\n`
      }
      content += '\n'
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'multiplication-table.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showMessage('Table downloaded successfully!')
  }

  const handleReset = () => {
    setStartNumber(1)
    setEndNumber(10)
    setMultiplier(10)
  }

  useEffect(() => {
    if (mode === 'practice' && !practiceQuestion) {
      generatePracticeQuestion()
    }
  }, [mode, startNumber, endNumber, multiplier])

  useEffect(() => {
    return () => {
      if (quizTimer) {
        clearInterval(quizTimer)
      }
    }
  }, [quizTimer])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('table')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'table'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => {
              setMode('practice')
              generatePracticeQuestion()
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'practice'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Play className="h-4 w-4 inline mr-1" />
            Practice
          </button>
          <button
            onClick={() => {
              setMode('quiz')
              startQuiz()
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              mode === 'quiz'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Trophy className="h-4 w-4 inline mr-1" />
            Quiz
          </button>
        </div>

        {mode === 'table' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Number
                </label>
                <input
              type="number"
              min={1}
              max={100}
              value={startNumber}
              onChange={(e) => setStartNumber(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Number
                </label>
                <input
              type="number"
              min={1}
              max={100}
              value={endNumber}
              onChange={(e) => setEndNumber(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiply Up To
                </label>
                <input
              type="number"
              min={1}
              max={100}
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <Printer className="h-4 w-4 mr-2" />
            Print
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
            Download
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
            Reset
              </button>
            </div>
          </div>
        )}

        {mode === 'practice' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-4">
                {practiceQuestion && `${practiceQuestion.a} × ${practiceQuestion.b} = ?`}
              </div>
              <div className="flex justify-center gap-4 mb-4">
                <input
                  type="number"
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      checkPracticeAnswer()
                    }
                  }}
                  placeholder="Enter answer..."
                  className="w-32 text-center text-2xl font-bold rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
              <button
                onClick={checkPracticeAnswer}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Check Answer
              </button>
              <div className="mt-4 text-sm text-gray-600">
                Score: {practiceScore.correct} / {practiceScore.total}
                {practiceScore.total > 0 && (
                  <span className="ml-2">
                    ({Math.round((practiceScore.correct / practiceScore.total) * 100)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {mode === 'quiz' && (
          <div className="space-y-4">
            {quizStats ? (
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-indigo-600 mb-4">
                  Quiz Results
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{quizStats.correct}</div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{quizStats.incorrect}</div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{quizStats.time}s</div>
                    <div className="text-sm text-gray-600">Time</div>
                  </div>
                </div>
                <div className="text-lg font-medium">
                  Score: {Math.round((quizStats.correct / quizStats.total) * 100)}%
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {quizQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded border ${
                        q.userAnswer === q.answer
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {q.a} × {q.b} = {q.userAnswer}
                        </span>
                        {q.userAnswer === q.answer ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      {q.userAnswer !== q.answer && (
                        <div className="text-sm text-gray-600 mt-1">
                          Correct answer: {q.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={startQuiz}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                  <Clock className="h-5 w-5" />
                  <span>Time: {quizTime}s</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  {quizQuestions[currentQuizIndex] &&
                    `${quizQuestions[currentQuizIndex].a} × ${quizQuestions[currentQuizIndex].b} = ?`}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Question {currentQuizIndex + 1} of {quizQuestions.length}
                </div>
                <div className="flex justify-center gap-4 mb-4">
                  <input
                    type="number"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        submitQuizAnswer()
                      }
                    }}
                    placeholder="Enter answer..."
                    className="w-32 text-center text-2xl font-bold rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                <button
                  onClick={submitQuizAnswer}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {currentQuizIndex < quizQuestions.length - 1 ? 'Next' : 'Finish'}
                </button>
              </div>
            )}
          </div>
        )}
        </div>

      {mode === 'table' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-3">
        {Array.from({ length: endNumber - startNumber + 1 }, (_, i) => startNumber + i).map(
          (num) => (
              <div key={num} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Table of {num}
              </h3>
              <div className="space-y-2">
                {Array.from({ length: multiplier }, (_, i) => i + 1).map((mult) => (
                  <div
                    key={mult}
                    className="flex justify-between items-center py-1 border-b last:border-0"
                  >
                    <span>
                      {num} × {mult}
                    </span>
                    <span className="font-semibold">{num * mult}</span>
                  </div>
                ))}
              </div>
              </div>
          )
        )}
      </div>
      )}

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
