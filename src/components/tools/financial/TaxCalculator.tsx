'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface TaxResult {
  totalIncome: number
  totalDeductions: number
  taxableIncome: number
  taxAmount: number
  effectiveTaxRate: number
}

export function TaxCalculator() {
  const [income, setIncome] = useState('')
  const [deductions, setDeductions] = useState('')
  const [result, setResult] = useState<TaxResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const validateInputs = () => {
    if (!income) {
      setToastMessage('Please enter your income')
      setToastType('error')
      setShowToast(true)
      return false
    }

    const numIncome = parseFloat(income)
    const numDeductions = parseFloat(deductions || '0')

    if (isNaN(numIncome) || isNaN(numDeductions)) {
      setToastMessage('Please enter valid numbers')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numIncome < 0 || numDeductions < 0) {
      setToastMessage('Values cannot be negative')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numDeductions > numIncome) {
      setToastMessage('Deductions cannot be more than income')
      setToastType('error')
      setShowToast(true)
      return false
    }

    return true
  }

  const calculateTax = () => {
    if (!validateInputs()) return

    const totalIncome = parseFloat(income)
    const totalDeductions = parseFloat(deductions || '0')
    const taxableIncome = totalIncome - totalDeductions

    // Tax slabs (example for demonstration)
    let taxAmount = 0
    if (taxableIncome <= 250000) {
      taxAmount = 0
    } else if (taxableIncome <= 500000) {
      taxAmount = (taxableIncome - 250000) * 0.05
    } else if (taxableIncome <= 750000) {
      taxAmount = 12500 + (taxableIncome - 500000) * 0.10
    } else if (taxableIncome <= 1000000) {
      taxAmount = 37500 + (taxableIncome - 750000) * 0.15
    } else if (taxableIncome <= 1250000) {
      taxAmount = 75000 + (taxableIncome - 1000000) * 0.20
    } else if (taxableIncome <= 1500000) {
      taxAmount = 125000 + (taxableIncome - 1250000) * 0.25
    } else {
      taxAmount = 187500 + (taxableIncome - 1500000) * 0.30
    }

    // Add 4% health and education cess
    taxAmount = taxAmount + (taxAmount * 0.04)

    const effectiveTaxRate = (taxAmount / taxableIncome) * 100

    setResult({
      totalIncome,
      totalDeductions,
      taxableIncome,
      taxAmount,
      effectiveTaxRate
    })

    setToastMessage('Tax calculation completed!')
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
    setIncome('')
    setDeductions('')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Income
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your total income"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Deductions
            </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter total deductions (optional)"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateTax}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate Tax
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
            <h3 className="text-lg font-medium text-gray-900">Tax Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Income</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.totalIncome)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.totalDeductions)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxable Income</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.taxableIncome)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tax Amount</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(result.taxAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Effective Tax Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {result.effectiveTaxRate.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Tax Slabs</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Up to ₹2.5L: No tax</li>
                <li>₹2.5L to ₹5L: 5%</li>
                <li>₹5L to ₹7.5L: 10%</li>
                <li>₹7.5L to ₹10L: 15%</li>
                <li>₹10L to ₹12.5L: 20%</li>
                <li>₹12.5L to ₹15L: 25%</li>
                <li>Above ₹15L: 30%</li>
                <li>* Additional 4% Health & Education Cess</li>
              </ul>
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