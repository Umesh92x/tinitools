'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

type CalculationType = 'add-gst' | 'remove-gst'

interface GSTResult {
  originalAmount: number
  gstAmount: number
  totalAmount: number
  cgst?: number
  sgst?: number
  igst?: number
}

const GST_RATES = [3, 5, 12, 18, 28]

export function GSTCalculator() {
  const [amount, setAmount] = useState('')
  const [gstRate, setGstRate] = useState('18')
  const [calculationType, setCalculationType] = useState<CalculationType>('add-gst')
  const [splitGst, setSplitGst] = useState(true)
  const [result, setResult] = useState<GSTResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const validateInputs = () => {
    if (!amount || !gstRate) {
      setToastMessage('Please enter amount and select a GST rate.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    const numAmount = parseFloat(amount)
    const numRate = parseFloat(gstRate)

    if (isNaN(numAmount) || isNaN(numRate)) {
      setToastMessage('Please enter valid numeric values.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numAmount <= 0) {
      setToastMessage('Amount must be greater than 0.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numRate <= 0) {
      setToastMessage('GST rate must be greater than 0%.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    return true
  }

  const calculateGST = () => {
    if (!validateInputs()) return

    const numAmount = parseFloat(amount)
    const numRate = parseFloat(gstRate)
    let originalAmount: number
    let gstAmount: number
    let totalAmount: number

    if (calculationType === 'add-gst') {
      originalAmount = numAmount
      gstAmount = (originalAmount * numRate) / 100
      totalAmount = originalAmount + gstAmount
    } else {
      totalAmount = numAmount
      originalAmount = (totalAmount * 100) / (100 + numRate)
      gstAmount = totalAmount - originalAmount
    }

    const result: GSTResult = {
      originalAmount,
      gstAmount,
      totalAmount,
    }

    if (splitGst) {
      const halfGst = gstAmount / 2
      result.cgst = halfGst
      result.sgst = halfGst
    } else {
      result.igst = gstAmount
    }

    setResult(result)
    setToastMessage('GST calculation completed!')
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
    setAmount('')
    setGstRate('18')
    setCalculationType('add-gst')
    setSplitGst(true)
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calculation Type
            </label>
            <div className="mt-1 flex gap-4">
              <button
                onClick={() => setCalculationType('add-gst')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  calculationType === 'add-gst'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Add GST
              </button>
              <button
                onClick={() => setCalculationType('remove-gst')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  calculationType === 'remove-gst'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Remove GST
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {calculationType === 'add-gst' ? 'Original Amount' : 'Total Amount (Including GST)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST Rate (%)
            </label>
            <select
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {GST_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={splitGst}
                onChange={(e) => setSplitGst(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Split into CGST & SGST</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateGST}
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
            <h3 className="text-lg font-medium text-gray-900">GST Calculation Summary</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  {calculationType === 'add-gst' ? 'Original Amount' : 'Amount (Excluding GST)'}
                </p>
                <p className="text-xl font-semibold text-gray-900">
                  ₹{formatCurrency(result.originalAmount)}
                </p>
              </div>

              {splitGst ? (
                <>
                  <div>
                    <p className="text-sm text-gray-600">CGST @ {parseFloat(gstRate) / 2}%</p>
                    <p className="text-xl font-semibold text-indigo-600">
                      ₹{formatCurrency(result.cgst!)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">SGST @ {parseFloat(gstRate) / 2}%</p>
                    <p className="text-xl font-semibold text-indigo-600">
                      ₹{formatCurrency(result.sgst!)}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">IGST @ {gstRate}%</p>
                  <p className="text-xl font-semibold text-indigo-600">
                    ₹{formatCurrency(result.igst!)}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Total Amount (Including GST)</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{formatCurrency(result.totalAmount)}
                </p>
              </div>
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