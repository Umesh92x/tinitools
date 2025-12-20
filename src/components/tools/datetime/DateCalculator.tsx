'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type CalculationType = 'difference' | 'add' | 'subtract'

interface DateDifference {
  years: number
  months: number
  days: number
}

export function DateCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('difference')
  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [unit, setUnit] = useState<'days' | 'months' | 'years'>('days')
  const [result, setResult] = useState<string>('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const calculateDateDifference = (start: Date, end: Date): DateDifference => {
    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()

    if (days < 0) {
      months -= 1
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years -= 1
      months += 12
    }

    return { years, months, days }
  }

  const addToDate = (date: Date, amount: number, unit: 'days' | 'months' | 'years'): Date => {
    const result = new Date(date)
    switch (unit) {
      case 'days':
        result.setDate(result.getDate() + amount)
        break
      case 'months':
        result.setMonth(result.getMonth() + amount)
        break
      case 'years':
        result.setFullYear(result.getFullYear() + amount)
        break
    }
    return result
  }

  const handleCalculate = () => {
    try {
      if (calculationType === 'difference') {
        if (!date1 || !date2) {
          throw new Error('Please select both dates')
        }
        const d1 = new Date(date1)
        const d2 = new Date(date2)
        const diff = calculateDateDifference(d1, d2)
        setResult(`Difference: ${diff.years} years, ${diff.months} months, and ${diff.days} days`)
      } else {
        if (!date1 || !amount) {
          throw new Error('Please fill in all fields')
        }
        const d1 = new Date(date1)
        const resultDate = addToDate(
          d1,
          calculationType === 'subtract' ? -amount : amount,
          unit
        )
        setResult(`Result: ${resultDate.toLocaleDateString()}`)
      }
      setToastMessage('Calculation completed successfully!')
      setShowToast(true)
    } catch (err) {
      setToastMessage((err as Error).message)
      setShowToast(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setCalculationType('difference')}
          className={`flex-1 py-2 px-4 rounded-md ${
            calculationType === 'difference'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Calculate Difference
        </button>
        <button
          onClick={() => setCalculationType('add')}
          className={`flex-1 py-2 px-4 rounded-md ${
            calculationType === 'add'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Add to Date
        </button>
        <button
          onClick={() => setCalculationType('subtract')}
          className={`flex-1 py-2 px-4 rounded-md ${
            calculationType === 'subtract'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Subtract from Date
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {calculationType === 'difference' ? 'Start Date' : 'Date'}
          </label>
          <input
            type="date"
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {calculationType === 'difference' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                  className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as 'days' | 'months' | 'years')}
                  className="rounded-r-md border-l-0 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-lg font-medium text-gray-900">{result}</p>
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