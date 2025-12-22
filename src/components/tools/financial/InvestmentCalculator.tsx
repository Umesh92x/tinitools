'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface InvestmentResult {
  initialInvestment: number
  monthlyInvestment: number
  totalInvestment: number
  totalReturns: number
  finalAmount: number
  yearlyBreakdown: {
    year: number
    investedAmount: number
    returns: number
    totalAmount: number
  }[]
}

export function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState('')
  const [monthlyInvestment, setMonthlyInvestment] = useState('')
  const [returnRate, setReturnRate] = useState('')
  const [years, setYears] = useState('')
  const [investmentType, setInvestmentType] = useState('equity') // equity, debt, hybrid
  const [result, setResult] = useState<InvestmentResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const validateInputs = () => {
    if (!initialAmount && !monthlyInvestment) {
      setToastMessage('Enter at least an initial investment or a monthly investment.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (!returnRate || !years) {
      setToastMessage('Please fill in expected return rate and investment period.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    const numInitial = parseFloat(initialAmount)
    const numMonthly = parseFloat(monthlyInvestment)
    const numRate = parseFloat(returnRate)
    const numYears = parseFloat(years)

    if (
      isNaN(numInitial) ||
      isNaN(numMonthly) ||
      isNaN(numRate) ||
      isNaN(numYears)
    ) {
      setToastMessage('Please enter valid numeric values.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numInitial < 0 || numMonthly < 0 || numRate < 0 || numYears <= 0) {
      setToastMessage('Amounts cannot be negative and years must be greater than 0.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numRate > 100) {
      setToastMessage('Return rate looks too high. Please enter a realistic annual rate (0–100%).')
      setToastType('error')
      setShowToast(true)
      return false
    }

    return true
  }

  const calculateInvestment = () => {
    if (!validateInputs()) return

    const initial = parseFloat(initialAmount)
    const monthly = parseFloat(monthlyInvestment)
    const rate = parseFloat(returnRate) / 100
    const period = parseFloat(years)

    const yearlyBreakdown = []
    let totalAmount = initial
    let totalInvested = initial

    for (let year = 1; year <= period; year++) {
      const yearlyInvestment = monthly * 12
      totalInvested += yearlyInvestment

      // Calculate returns based on investment type
      let effectiveRate = rate
      if (investmentType === 'debt') {
        effectiveRate = rate * 0.7 // Lower returns for debt
      } else if (investmentType === 'hybrid') {
        effectiveRate = rate * 0.85 // Moderate returns for hybrid
      }

      const yearlyReturns = totalAmount * effectiveRate
      totalAmount = totalAmount + yearlyInvestment + yearlyReturns

      yearlyBreakdown.push({
        year,
        investedAmount: totalInvested,
        returns: totalAmount - totalInvested,
        totalAmount
      })
    }

    const totalReturns = totalAmount - totalInvested

    setResult({
      initialInvestment: initial,
      monthlyInvestment: monthly,
      totalInvestment: totalInvested,
      totalReturns,
      finalAmount: totalAmount,
      yearlyBreakdown
    })

    setToastMessage('Investment calculation completed!')
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
    setInitialAmount('')
    setMonthlyInvestment('')
    setReturnRate('')
    setYears('')
    setInvestmentType('equity')
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Initial Investment
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter initial investment amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Investment
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter monthly investment amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expected Annual Return Rate (%)
            </label>
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter expected return rate"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Investment Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter investment period"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Investment Type
            </label>
            <select
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="equity">Equity (Stocks/Mutual Funds)</option>
              <option value="debt">Debt (Bonds/FDs)</option>
              <option value="hybrid">Hybrid (Balanced Funds)</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateInvestment}
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
            <h3 className="text-lg font-medium text-gray-900">Investment Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Initial Investment</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.initialInvestment)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Investment</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.monthlyInvestment)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount Invested</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.totalInvestment)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Returns</p>
                <p className="text-lg font-semibold text-indigo-600">
                  {formatCurrency(result.totalReturns)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Final Amount</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(result.finalAmount)}
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
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Invested</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Returns</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.yearlyBreakdown.map((item) => (
                      <tr key={item.year}>
                        <td className="px-3 py-2 text-sm text-gray-900">{item.year}</td>
                        <td className="px-3 py-2 text-sm text-gray-900 text-right">
                          {formatCurrency(item.investedAmount)}
                        </td>
                        <td className="px-3 py-2 text-sm text-indigo-600 text-right">
                          {formatCurrency(item.returns)}
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.totalAmount)}
                        </td>
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