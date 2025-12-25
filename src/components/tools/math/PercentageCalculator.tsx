'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type CalculationType = 'basic' | 'change' | 'increase' | 'decrease'

interface CalculationResult {
  result: number
  explanation: string
}

export function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('basic')
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const validateInputs = () => {
    if (!number1.trim() || !number2.trim()) {
      showMessage('Please enter both numbers', 'error')
      return false
    }

    const n1 = parseFloat(number1)
    const n2 = parseFloat(number2)

    if (isNaN(n1) || isNaN(n2)) {
      showMessage('Please enter valid numbers', 'error')
      return false
    }

    if (calculationType === 'change' && n1 === 0) {
      showMessage('Original value cannot be 0 when calculating percentage change', 'error')
      return false
    }

    return true
  }

  const calculate = () => {
    if (!validateInputs()) return

    const n1 = parseFloat(number1)
    const n2 = parseFloat(number2)
    let calculationResult: CalculationResult

    switch (calculationType) {
      case 'basic':
        calculationResult = {
          result: (n1 * n2) / 100,
          explanation: `${n2}% of ${n1} = ${(n1 * n2) / 100}`
        }
        break

      case 'change':
        const change = ((n2 - n1) / n1) * 100
        calculationResult = {
          result: change,
          explanation: `Percentage change from ${n1} to ${n2} = ${change.toFixed(2)}%`
        }
        break

      case 'increase':
        const increased = n1 * (1 + n2 / 100)
        calculationResult = {
          result: increased,
          explanation: `${n1} increased by ${n2}% = ${increased}`
        }
        break

      case 'decrease':
        const decreased = n1 * (1 - n2 / 100)
        calculationResult = {
          result: decreased,
          explanation: `${n1} decreased by ${n2}% = ${decreased}`
        }
        break
    }

    setResult(calculationResult)
    showMessage('Calculation completed!')
  }

  const getInputLabels = () => {
    switch (calculationType) {
      case 'basic':
        return {
          number1: 'Number',
          number2: 'Percentage'
        }
      case 'change':
        return {
          number1: 'Original Value',
          number2: 'New Value'
        }
      case 'increase':
        return {
          number1: 'Original Value',
          number2: 'Increase Percentage'
        }
      case 'decrease':
        return {
          number1: 'Original Value',
          number2: 'Decrease Percentage'
        }
    }
  }

  const handleReset = () => {
    setNumber1('')
    setNumber2('')
    setResult(null)
  }

  const copyResult = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(
        `${result.result.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`
      )
      showMessage('Result copied to clipboard')
    } catch {
      showMessage('Failed to copy result', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(['basic', 'change', 'increase', 'decrease'] as CalculationType[]).map((type) => (
          <button
            key={type}
            onClick={() => {
              setCalculationType(type)
              handleReset()
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              calculationType === type
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {getInputLabels().number1}
            </label>
            <input
              type="number"
              value={number1}
              onChange={(e) => setNumber1(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {getInputLabels().number2}
            </label>
            <input
              type="number"
              value={number2}
              onChange={(e) => setNumber2(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a number"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculate}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Result</h3>
            <div className="space-y-3">
              <p className="text-3xl font-bold text-indigo-600">
                {result.result.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
                {calculationType === 'change' && '%'}
              </p>
              <p className="text-sm text-gray-600">{result.explanation}</p>
              <button
                type="button"
                onClick={copyResult}
                className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Copy result
              </button>
            </div>
          </div>
        )}
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