'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface Preset {
  name: string
  min: string
  max: string
  count: string
  decimals: string
}

const presets: Preset[] = [
  { name: 'Dice (1-6)', min: '1', max: '6', count: '1', decimals: '0' },
  { name: 'Lottery (1-49)', min: '1', max: '49', count: '6', decimals: '0' },
  { name: 'Percentage (0-100)', min: '0', max: '100', count: '1', decimals: '2' },
  { name: 'Decimal (0-1)', min: '0', max: '1', count: '1', decimals: '4' },
  { name: 'Custom', min: '0', max: '100', count: '1', decimals: '0' },
]

export function RandomNumberGenerator() {
  const [min, setMin] = useState('0')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [decimals, setDecimals] = useState('0')
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [results, setResults] = useState<number[]>([])
  const [history, setHistory] = useState<number[][]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const generateNumbers = () => {
    try {
      const minNum = parseFloat(min)
      const maxNum = parseFloat(max)
      const countNum = parseInt(count)
      const decimalsNum = parseInt(decimals)

      if (isNaN(minNum) || isNaN(maxNum) || isNaN(countNum) || isNaN(decimalsNum)) {
        throw new Error('Please enter valid numbers')
      }

      if (minNum >= maxNum) {
        throw new Error('Maximum number must be greater than minimum number')
      }

      if (countNum < 1) {
        throw new Error('Count must be at least 1')
      }

      if (decimalsNum < 0) {
        throw new Error('Decimal places cannot be negative')
      }

      // Calculate maximum possible unique numbers based on range and decimals
      const range = maxNum - minNum
      const step = Math.pow(10, -decimalsNum)
      const maxUniqueNumbers = Math.floor(range / step) + 1

      if (!allowDuplicates && countNum > maxUniqueNumbers) {
        throw new Error(`Cannot generate ${countNum} unique numbers. Maximum possible: ${maxUniqueNumbers}`)
      }

      const newResults: number[] = []
      const usedNumbers = new Set<number>()
      let attempts = 0
      const maxAttempts = countNum * 1000 // Safety limit to prevent infinite loops

      while (newResults.length < countNum && attempts < maxAttempts) {
        attempts++
        const randomNum = Math.random() * (maxNum - minNum) + minNum
        const roundedNum = parseFloat(randomNum.toFixed(decimalsNum))

        // Ensure the rounded number is within bounds
        if (roundedNum < minNum || roundedNum > maxNum) {
          continue
        }

        if (!allowDuplicates && usedNumbers.has(roundedNum)) {
          continue
        }

        newResults.push(roundedNum)
        usedNumbers.add(roundedNum)
      }

      if (newResults.length < countNum) {
        throw new Error(`Could not generate ${countNum} unique numbers. Generated ${newResults.length}. Try allowing duplicates or increasing the range.`)
      }

      setResults(newResults)
      setHistory((prev) => [newResults, ...prev].slice(0, 10)) // Keep last 10 generations
      setToastMessage('Numbers generated successfully!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'An error occurred')
      setToastType('error')
      setShowToast(true)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join(', '))
    setToastMessage('Numbers copied to clipboard!')
    setToastType('success')
    setShowToast(true)
  }

  const applyPreset = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName)
    if (preset) {
      setMin(preset.min)
      setMax(preset.max)
      setCount(preset.count)
      setDecimals(preset.decimals)
      setSelectedPreset(presetName)
    }
  }

  const clearHistory = () => {
    setHistory([])
    setToastMessage('History cleared!')
    setToastType('success')
    setShowToast(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => applyPreset(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {presets.map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum
                </label>
                <input
                  type="number"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum
                </label>
                <input
                  type="number"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Count
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Decimal Places
                </label>
                <input
                  type="number"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Allow duplicate numbers
                </span>
              </label>
            </div>

            <button
              onClick={generateNumbers}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Numbers
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Results</h3>
              <div className="flex gap-2">
                {results.length > 0 && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Copy
                  </button>
                )}
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-gray-600 hover:text-gray-500"
                  >
                    Clear History
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-md min-h-[100px] break-all">
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((num, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-600">#{index + 1}</span>
                      <span className="font-medium text-lg">{num}</span>
                    </div>
                  ))}
                  {results.length > 1 && (
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sum:</span>
                        <span className="font-medium">{results.reduce((a, b) => a + b, 0).toFixed(parseInt(decimals))}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Average:</span>
                        <span className="font-medium">{(results.reduce((a, b) => a + b, 0) / results.length).toFixed(parseInt(decimals))}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  Generated numbers will appear here
                </p>
              )}
            </div>
          </div>

          {history.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">History</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((hist, index) => (
                  <div key={index} className="bg-white p-3 rounded-md text-sm">
                    <div className="text-gray-500 mb-1">Generation #{history.length - index}</div>
                    <div className="text-gray-700">{hist.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Set Range</h4>
                <p className="text-sm text-gray-600">
                  Enter the minimum and maximum numbers for your range.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Configure Options</h4>
                <p className="text-sm text-gray-600">
                  Choose how many numbers to generate and set decimal places.
                  Toggle duplicate numbers if needed.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Generate & Copy</h4>
                <p className="text-sm text-gray-600">
                  Click "Generate Numbers" to create random numbers.
                  Use "Copy to Clipboard" to save results.
                </p>
              </div>
            </div>
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