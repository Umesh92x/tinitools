'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface CompoundInterestResult {
  principal: number
  totalAmount: number
  totalInterest: number
  yearlyBreakdown: {
    year: number
    amount: number
    interest: number
  }[]
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [time, setTime] = useState('')
  const [frequency, setFrequency] = useState('1') // 1 = annually, 4 = quarterly, 12 = monthly
  const [result, setResult] = useState<CompoundInterestResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const validateInputs = () => {
    if (!principal || !rate || !time) {
      setToastMessage('Please fill in principal amount, interest rate, and time period.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    const numPrincipal = parseFloat(principal)
    const numRate = parseFloat(rate)
    const numTime = parseFloat(time)

    if (isNaN(numPrincipal) || isNaN(numRate) || isNaN(numTime)) {
      setToastMessage('Please enter valid numeric values.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numPrincipal <= 0 || numTime <= 0) {
      setToastMessage('Principal and time period must be greater than 0.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numRate < 0) {
      setToastMessage('Interest rate cannot be negative.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    return true
  }

  const calculateCompoundInterest = () => {
    if (!validateInputs()) return

    const p = parseFloat(principal)
    const r = parseFloat(rate) / 100
    const t = parseFloat(time)
    const n = parseInt(frequency)

    const yearlyBreakdown = []
    let prevAmount = p

    for (let year = 1; year <= t; year++) {
      const amount =
        r === 0
          ? p
          : p * Math.pow(1 + r / n, n * year)
      const yearlyInterest = amount - prevAmount
      
      yearlyBreakdown.push({
        year,
        amount,
        interest: yearlyInterest
      })

      prevAmount = amount
    }

    const totalAmount = yearlyBreakdown[yearlyBreakdown.length - 1].amount
    const totalInterest = totalAmount - p

    setResult({
      principal: p,
      totalAmount,
      totalInterest,
      yearlyBreakdown
    })

    setToastMessage('Calculation completed!')
    setToastType('success')
    setShowToast(true)
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })
  }

  const handleReset = () => {
    setPrincipal('')
    setRate('')
    setTime('')
    setFrequency('1')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Principal Amount
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter principal amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter interest rate"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time Period (Years)
            </label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter time period"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Compounding Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="1">Annually</option>
              <option value="2">Semi-annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateCompoundInterest}
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
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Results</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Principal Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.principal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interest Earned</p>
                <p className="text-lg font-semibold text-indigo-600">
                  {formatCurrency(result.totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(result.totalAmount)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Year-wise Breakdown</h4>
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Interest</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.yearlyBreakdown.map((item) => (
                      <tr key={item.year}>
                        <td className="px-3 py-2 text-sm text-gray-900">{item.year}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                        <td className="px-3 py-2 text-sm text-indigo-600 text-right">{formatCurrency(item.interest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 