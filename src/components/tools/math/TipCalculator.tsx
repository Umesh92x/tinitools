'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface TipResult {
  tipAmount: number
  totalAmount: number
  perPerson: number
  tipPerPerson: number
}

const tipPercentages = [5, 10, 15, 18, 20, 25]

type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD'

const currencies: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'USD – US Dollar' },
  { code: 'INR', symbol: '₹', label: 'INR – Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'EUR – Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP – British Pound' },
  { code: 'AUD', symbol: 'A$', label: 'AUD – Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'CAD – Canadian Dollar' },
]

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState('')
  const [tipPercentage, setTipPercentage] = useState(15)
  const [customTip, setCustomTip] = useState('')
  const [numPeople, setNumPeople] = useState('1')
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [result, setResult] = useState<TipResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const currencyInfo = currencies.find((c) => c.code === currency) ?? currencies[0]
  const currencySymbol = currencyInfo.symbol

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const calculateTip = () => {
    try {
      const bill = parseFloat(billAmount)
      const people = parseInt(numPeople)
      const tip = customTip ? parseFloat(customTip) : tipPercentage

      if (isNaN(bill) || bill <= 0) {
        throw new Error('Please enter a valid bill amount')
      }

      if (isNaN(people) || people < 1) {
        throw new Error('Number of people must be at least 1')
      }

      if (isNaN(tip) || tip < 0) {
        throw new Error('Please enter a valid tip percentage')
      }

      const tipAmount = (bill * tip) / 100
      const totalAmount = bill + tipAmount
      const perPerson = totalAmount / people
      const tipPerPerson = tipAmount / people

      setResult({
        tipAmount,
        totalAmount,
        perPerson,
        tipPerPerson,
      })

      if (tip > 100) {
        showMessage('Very high tip – double-check the percentage', 'error')
      } else {
        showMessage('Tip calculated successfully')
      }
    } catch (error) {
      setResult(null)
      showMessage(error instanceof Error ? error.message : 'Invalid input', 'error')
    }
  }

  const resetCalculator = () => {
    setBillAmount('')
    setTipPercentage(15)
    setCustomTip('')
    setNumPeople('1')
    setResult(null)
  }

  const handleTipSelect = (percentage: number) => {
    setTipPercentage(percentage)
    setCustomTip('')
  }

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value)
    setTipPercentage(0)
  }

  const effectiveTipPercent = () => {
    if (!result) return null
    const bill = parseFloat(billAmount)
    if (!bill || bill <= 0) return null
    return (result.tipAmount / bill) * 100
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        {/* Currency Selection */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Currency</p>
            <p className="text-xs text-gray-500">
              Only changes the currency symbol, not the actual amount.
            </p>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bill Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bill Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currencySymbol}</span>
            </div>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tip Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tip %
          </label>
          <div className="grid grid-cols-3 gap-2">
            {tipPercentages.map((percent) => (
              <button
                key={percent}
                onClick={() => handleTipSelect(percent)}
                className={`p-2 rounded ${
                  tipPercentage === percent && !customTip
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {percent}%
              </button>
            ))}
          </div>
          <div className="mt-2">
            <input
              type="number"
              value={customTip}
              onChange={(e) => handleCustomTipChange(e.target.value)}
              placeholder="Custom tip %"
              min="0"
              step="0.1"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Number of People */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of People
          </label>
          <input
            type="number"
            value={numPeople}
            onChange={(e) => setNumPeople(e.target.value)}
            min="1"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={calculateTip}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calculate
          </button>
          <button
            onClick={resetCalculator}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">Tip Amount</p>
                  <p className="text-2xl font-semibold text-indigo-600">
                    {currencySymbol}
                    {result.tipAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    per person: {currencySymbol}
                    {result.tipPerPerson.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-semibold text-indigo-600">
                    {currencySymbol}
                    {result.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    per person: {currencySymbol}
                    {result.perPerson.toFixed(2)}
                  </p>
                </div>
              </div>
              {effectiveTipPercent() !== null && (
                <div className="text-xs text-gray-500">
                  Effective tip: {effectiveTipPercent()!.toFixed(1)}% of the bill.
                </div>
              )}
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