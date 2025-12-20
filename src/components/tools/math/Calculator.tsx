'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface HistoryItem {
  expression: string
  result: string
  timestamp: Date
}

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [memory, setMemory] = useState<number>(0)

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    if (display !== 'Error') {
      setExpression(expression + display + op)
      setDisplay('0')
    }
  }

  const handleDecimal = () => {
    if (!display.includes('.') && display !== 'Error') {
      setDisplay(display + '.')
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setExpression('')
  }

  const handleDelete = () => {
    if (display !== 'Error' && display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const handleMemoryAdd = () => {
    if (display !== 'Error') {
      setMemory(memory + parseFloat(display))
      setToastMessage('Added to memory')
      setToastType('success')
      setShowToast(true)
    }
  }

  const handleMemorySubtract = () => {
    if (display !== 'Error') {
      setMemory(memory - parseFloat(display))
      setToastMessage('Subtracted from memory')
      setToastType('success')
      setShowToast(true)
    }
  }

  const handleMemoryRecall = () => {
    setDisplay(memory.toString())
    setToastMessage('Memory recalled')
    setToastType('success')
    setShowToast(true)
  }

  const handleMemoryClear = () => {
    setMemory(0)
    setToastMessage('Memory cleared')
    setToastType('success')
    setShowToast(true)
  }

  const calculate = () => {
    try {
      const fullExpression = expression + display
      // Using Function instead of eval for better security
      const result = new Function('return ' + fullExpression)()
      
      // Add to history
      setHistory([
        {
          expression: fullExpression,
          result: result.toString(),
          timestamp: new Date(),
        },
        ...history.slice(0, 9), // Keep last 10 items
      ])

      setDisplay(result.toString())
      setExpression('')
    } catch (error) {
      setDisplay('Error')
      setToastMessage('Invalid expression')
      setToastType('error')
      setShowToast(true)
    }
  }

  const clearHistory = () => {
    setHistory([])
    setToastMessage('History cleared')
    setToastType('success')
    setShowToast(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          {/* Calculator Display */}
          <div className="bg-gray-100 p-4 rounded-lg text-right mb-4">
            <div className="text-gray-600 text-sm h-6">{expression}</div>
            <div className="text-3xl font-mono">{display}</div>
          </div>

          {/* Memory Controls */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              onClick={handleMemoryClear}
              className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              MC
            </button>
            <button
              onClick={handleMemoryRecall}
              className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              MR
            </button>
            <button
              onClick={handleMemoryAdd}
              className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              M+
            </button>
            <button
              onClick={handleMemorySubtract}
              className="p-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              M-
            </button>
          </div>

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={handleClear}
              className="p-4 bg-red-100 hover:bg-red-200 rounded text-red-700"
            >
              C
            </button>
            <button
              onClick={handleDelete}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded"
            >
              ←
            </button>
            <button
              onClick={() => handleOperator('%')}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded"
            >
              %
            </button>
            <button
              onClick={() => handleOperator('/')}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded"
            >
              ÷
            </button>
            <button
              onClick={() => handleNumber('7')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              7
            </button>
            <button
              onClick={() => handleNumber('8')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              8
            </button>
            <button
              onClick={() => handleNumber('9')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              9
            </button>
            <button
              onClick={() => handleOperator('*')}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded"
            >
              ×
            </button>
            <button
              onClick={() => handleNumber('4')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              4
            </button>
            <button
              onClick={() => handleNumber('5')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              5
            </button>
            <button
              onClick={() => handleNumber('6')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              6
            </button>
            <button
              onClick={() => handleOperator('-')}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded"
            >
              -
            </button>
            <button
              onClick={() => handleNumber('1')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              1
            </button>
            <button
              onClick={() => handleNumber('2')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              2
            </button>
            <button
              onClick={() => handleNumber('3')}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              3
            </button>
            <button
              onClick={() => handleOperator('+')}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded"
            >
              +
            </button>
            <button
              onClick={() => handleNumber('0')}
              className="p-4 bg-white hover:bg-gray-100 rounded col-span-2"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="p-4 bg-white hover:bg-gray-100 rounded"
            >
              .
            </button>
            <button
              onClick={calculate}
              className="p-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
            >
              =
            </button>
          </div>
        </div>

        {/* History Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">History</h3>
            <button
              onClick={clearHistory}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear History
            </button>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No calculations yet</p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-sm text-gray-600">{item.expression}</div>
                  <div className="text-lg font-mono">{item.result}</div>
                  <div className="text-xs text-gray-500">
                    {item.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
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