'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface EMIResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  amortizationSchedule: {
    month: number
    payment: number
    principal: number
    interest: number
    remainingBalance: number
  }[]
}

export function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTenure, setLoanTenure] = useState('')
  const [result, setResult] = useState<EMIResult | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const validateInputs = () => {
    if (!loanAmount || !interestRate || !loanTenure) {
      setToastMessage('Please fill in all fields')
      setToastType('error')
      setShowToast(true)
      return false
    }

    const amount = parseFloat(loanAmount)
    const rate = parseFloat(interestRate)
    const tenure = parseFloat(loanTenure)

    if (isNaN(amount) || isNaN(rate) || isNaN(tenure)) {
      setToastMessage('Please enter valid numbers')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (amount <= 0 || rate <= 0 || tenure <= 0) {
      setToastMessage('Values must be greater than 0')
      setToastType('error')
      setShowToast(true)
      return false
    }

    return true
  }

  const calculateEMI = () => {
    if (!validateInputs()) return

    const P = parseFloat(loanAmount)
    const R = parseFloat(interestRate) / (12 * 100) // Monthly interest rate
    const N = parseFloat(loanTenure) * 12 // Total number of months

    // EMI formula: P * R * (1 + R)^N / ((1 + R)^N - 1)
    const monthlyPayment = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)
    const totalPayment = monthlyPayment * N
    const totalInterest = totalPayment - P

    // Calculate amortization schedule
    let remainingBalance = P
    const schedule = []

    for (let month = 1; month <= N; month++) {
      const interest = remainingBalance * R
      const principal = monthlyPayment - interest
      remainingBalance -= principal

      schedule.push({
        month,
        payment: monthlyPayment,
        principal,
        interest,
        remainingBalance: Math.max(0, remainingBalance) // Avoid negative balance due to rounding
      })
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule: schedule
    })

    setToastMessage('EMI calculation completed!')
    setToastType('success')
    setShowToast(true)
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleReset = () => {
    setLoanAmount('')
    setInterestRate('')
    setLoanTenure('')
    setResult(null)
    setShowSchedule(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loan Amount
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter loan amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interest Rate (% per annum)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter annual interest rate"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loan Tenure (Years)
            </label>
            <input
              type="number"
              value={loanTenure}
              onChange={(e) => setLoanTenure(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter loan tenure in years"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateEMI}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate EMI
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
            <h3 className="text-lg font-medium text-gray-900">Loan Summary</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{formatCurrency(result.monthlyPayment)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interest</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{formatCurrency(result.totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payment</p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{formatCurrency(result.totalPayment)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              {showSchedule ? 'Hide' : 'Show'} Amortization Schedule
            </button>

            {showSchedule && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.amortizationSchedule.map((row) => (
                      <tr key={row.month}>
                        <td className="px-3 py-2 text-sm text-gray-900">{row.month}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">₹{formatCurrency(row.payment)}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">₹{formatCurrency(row.principal)}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">₹{formatCurrency(row.interest)}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">₹{formatCurrency(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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