'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

type Country = 'india' | 'us' | 'uk'
type IndiaRegime = 'old' | 'new'

interface TaxResult {
  totalIncome: number
  totalDeductions: number
  taxableIncome: number
  taxAmount: number
  effectiveTaxRate: number
}

interface IndiaComparison {
  old: TaxResult
  new: TaxResult
  recommended: IndiaRegime
}

const clampNonNegative = (value: number) => (value < 0 ? 0 : value)

function calculateIndiaOldRegime(
  totalIncome: number,
  ded80C: number,
  ded80D: number,
  dedHome: number,
  otherDeductions: number,
): TaxResult {
  const standardDeduction = 50000
  const capped80C = Math.min(ded80C, 150000)
  const capped80D = Math.min(ded80D, 25000)
  const cappedHome = Math.min(dedHome, 200000)

  const totalDeductions = standardDeduction + capped80C + capped80D + cappedHome + otherDeductions
  const taxableIncome = clampNonNegative(totalIncome - totalDeductions)

  let taxAmount = 0
  if (taxableIncome <= 250000) {
    taxAmount = 0
  } else if (taxableIncome <= 500000) {
    taxAmount = (taxableIncome - 250000) * 0.05
  } else if (taxableIncome <= 1000000) {
    taxAmount = 12500 + (taxableIncome - 500000) * 0.20
  } else {
    taxAmount = 112500 + (taxableIncome - 1000000) * 0.30
  }

  // 4% health and education cess
  taxAmount = taxAmount + taxAmount * 0.04

  const effectiveTaxRate = taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0

  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    taxAmount,
    effectiveTaxRate,
  }
}

function calculateIndiaNewRegime(totalIncome: number): TaxResult {
  // Approximate India new regime with standard deduction (₹75,000 for FY 2024-25) + Section 87A rebate up to ₹7L taxable income
  const standardDeduction = 75000
  const totalDeductions = standardDeduction
  const taxableIncome = clampNonNegative(totalIncome - totalDeductions)

  let taxBeforeRebate = 0
  if (taxableIncome <= 300000) {
    taxBeforeRebate = 0
  } else if (taxableIncome <= 700000) {
    // 5% on income between 3L and taxableIncome
    taxBeforeRebate = (taxableIncome - 300000) * 0.05
  } else if (taxableIncome <= 1000000) {
    taxBeforeRebate = 20000 + (taxableIncome - 700000) * 0.10
  } else if (taxableIncome <= 1200000) {
    taxBeforeRebate = 50000 + (taxableIncome - 1000000) * 0.15
  } else if (taxableIncome <= 1500000) {
    taxBeforeRebate = 80000 + (taxableIncome - 1200000) * 0.20
  } else {
    taxBeforeRebate = 140000 + (taxableIncome - 1500000) * 0.30
  }

  // Section 87A rebate: up to ₹7,00,000 taxable income, tax becomes zero
  let taxAfterRebate = taxBeforeRebate
  if (taxableIncome > 0 && taxableIncome <= 700000) {
    taxAfterRebate = 0
  }

  // 4% health & education cess on tax after rebate
  let taxAmount = taxAfterRebate + taxAfterRebate * 0.04

  const effectiveTaxRate = taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0

  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    taxAmount,
    effectiveTaxRate,
  }
}

function calculateUsTax(totalIncome: number, totalDeductions: number): TaxResult {
  const taxableIncome = clampNonNegative(totalIncome - totalDeductions)

  // Very simplified US federal tax for single filers (approximate)
  let taxAmount = 0
  if (taxableIncome <= 11000) {
    taxAmount = taxableIncome * 0.10
  } else if (taxableIncome <= 44725) {
    taxAmount = 1100 + (taxableIncome - 11000) * 0.12
  } else if (taxableIncome <= 95375) {
    taxAmount = 5147 + (taxableIncome - 44725) * 0.22
  } else if (taxableIncome <= 182100) {
    taxAmount = 16290 + (taxableIncome - 95375) * 0.24
  } else if (taxableIncome <= 231250) {
    taxAmount = 37104 + (taxableIncome - 182100) * 0.32
  } else if (taxableIncome <= 578125) {
    taxAmount = 52832 + (taxableIncome - 231250) * 0.35
  } else {
    taxAmount = 174238.25 + (taxableIncome - 578125) * 0.37
  }

  const effectiveTaxRate = taxableIncome > 0 ? (taxAmount / taxableIncome) * 100 : 0

  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    taxAmount,
    effectiveTaxRate,
  }
}

function calculateUkTax(totalIncome: number, totalDeductions: number): TaxResult {
  const personalAllowance = 12570
  const taxableBeforeAllowance = clampNonNegative(totalIncome - totalDeductions)
  const taxableIncome = clampNonNegative(taxableBeforeAllowance - personalAllowance)

  let taxAmount = 0
  if (taxableIncome <= 0) {
    taxAmount = 0
  } else if (taxableIncome <= 50270 - personalAllowance) {
    taxAmount = taxableIncome * 0.20
  } else if (taxableIncome <= 125140 - personalAllowance) {
    taxAmount =
      (50270 - personalAllowance) * 0.20 +
      (taxableIncome - (50270 - personalAllowance)) * 0.40
  } else {
    taxAmount =
      (50270 - personalAllowance) * 0.20 +
      (125140 - 50270) * 0.40 +
      (taxableIncome - (125140 - personalAllowance)) * 0.45
  }

  const effectiveTaxRate = taxableBeforeAllowance > 0 ? (taxAmount / taxableBeforeAllowance) * 100 : 0

  return {
    totalIncome,
    totalDeductions,
    taxableIncome: taxableBeforeAllowance,
    taxAmount,
    effectiveTaxRate,
  }
}

export function TaxCalculator() {
  const [country, setCountry] = useState<Country>('india')
  const [indiaRegime, setIndiaRegime] = useState<IndiaRegime>('new')

  const [income, setIncome] = useState('')
  const [deductions, setDeductions] = useState('') // generic / other deductions

  // India-specific deductions (old regime)
  const [ded80C, setDed80C] = useState('')
  const [ded80D, setDed80D] = useState('')
  const [dedHomeLoan, setDedHomeLoan] = useState('')
  const [includeEPF, setIncludeEPF] = useState(true)

  const [result, setResult] = useState<TaxResult | null>(null)
  const [indiaComparison, setIndiaComparison] = useState<IndiaComparison | null>(null)

  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const validateInputs = () => {
    if (!income) {
      setToastMessage('Please enter your total income.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    const numIncome = parseFloat(income)
    const numDeductions = parseFloat(deductions || '0')
    const num80C = parseFloat(ded80C || '0')
    const num80D = parseFloat(ded80D || '0')
    const numHome = parseFloat(dedHomeLoan || '0')

    if (
      Number.isNaN(numIncome) ||
      Number.isNaN(numDeductions) ||
      Number.isNaN(num80C) ||
      Number.isNaN(num80D) ||
      Number.isNaN(numHome)
    ) {
      setToastMessage('Please enter valid numeric values.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (numIncome < 0 || numDeductions < 0 || num80C < 0 || num80D < 0 || numHome < 0) {
      setToastMessage('Income and deductions cannot be negative.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (country === 'india') {
      const effective80C = num80C + (includeEPF ? 21600 : 0)
      const capped80C = Math.min(effective80C, 150000)
      const capped80D = Math.min(num80D, 25000)
      const cappedHome = Math.min(numHome, 200000)
      const totalDeds = capped80C + capped80D + cappedHome + numDeductions

      if (totalDeds > numIncome) {
        setToastMessage('Total deductions cannot be more than income.')
        setToastType('error')
        setShowToast(true)
        return false
      }
    } else {
    if (numDeductions > numIncome) {
        setToastMessage('Deductions cannot be more than income.')
      setToastType('error')
      setShowToast(true)
      return false
      }
    }

    return true
  }

  const calculateTax = () => {
    if (!validateInputs()) return

    const totalIncome = parseFloat(income)
    const otherDeductions = parseFloat(deductions || '0')
    const num80C = parseFloat(ded80C || '0')
    const num80D = parseFloat(ded80D || '0')
    const numHome = parseFloat(dedHomeLoan || '0')

    if (country === 'india') {
      const effective80C = num80C + (includeEPF ? 21600 : 0)
      const oldResult = calculateIndiaOldRegime(totalIncome, effective80C, num80D, numHome, otherDeductions)
      const newResult = calculateIndiaNewRegime(totalIncome)

      const recommended: IndiaRegime =
        oldResult.taxAmount <= newResult.taxAmount ? 'old' : 'new'

      setIndiaComparison({ old: oldResult, new: newResult, recommended })
      setResult(indiaRegime === 'old' ? oldResult : newResult)
    } else if (country === 'us') {
      // For US, "deductions" can be used for standard/itemized deductions
      const usResult = calculateUsTax(totalIncome, otherDeductions)
      setResult(usResult)
      setIndiaComparison(null)
    } else if (country === 'uk') {
      const ukResult = calculateUkTax(totalIncome, otherDeductions)
      setResult(ukResult)
      setIndiaComparison(null)
    }

    setToastMessage('Tax calculation completed!')
    setToastType('success')
    setShowToast(true)
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString(undefined, {
      style: 'currency',
      currency: country === 'us' ? 'USD' : country === 'uk' ? 'GBP' : 'INR',
      maximumFractionDigits: 0,
    })
  }

  const handleReset = () => {
    setIncome('')
    setDeductions('')
    setDed80C('')
    setDed80D('')
    setDedHomeLoan('')
    setResult(null)
    setIndiaComparison(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Country Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => {
                const value = e.target.value as Country
                setCountry(value)
                // Reset comparison when switching away from India
                if (value !== 'india') {
                  setIndiaComparison(null)
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="india">India</option>
              <option value="us">United States (federal, single filer)</option>
              <option value="uk">United Kingdom</option>
            </select>
          </div>

          {/* India regime toggle */}
          {country === 'india' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tax Regime (India)
              </label>
              <div className="mt-1 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIndiaRegime('new')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    indiaRegime === 'new'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  New Regime
                </button>
                <button
                  type="button"
                  onClick={() => setIndiaRegime('old')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    indiaRegime === 'old'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Old Regime
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                When you choose the old regime, we&apos;ll still calculate both old and new for comparison.
              </p>
            </div>
          )}

          {/* Total Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Income ({country === 'us' ? 'USD' : country === 'uk' ? 'GBP' : 'INR'})
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your total income"
              min={0}
            />
          </div>

          {/* India-specific deduction fields */}
          {country === 'india' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  80C Deductions (LIC, PPF, ELSS, etc.)
                </label>
                <input
                  type="number"
                  value={ded80C}
                  onChange={(e) => setDed80C(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Up to ₹1,50,000"
                  min={0}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Capped at ₹1,50,000 for old regime.
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    id="include-epf"
                    type="checkbox"
                    checked={includeEPF}
                    onChange={(e) => setIncludeEPF(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="include-epf" className="text-xs text-gray-600">
                    Include default EPF (employee contribution) of approximately ₹21,600/year in 80C.
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  80D (Health Insurance Premiums)
                </label>
                <input
                  type="number"
                  value={ded80D}
                  onChange={(e) => setDed80D(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Up to ₹25,000"
                  min={0}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Basic cap of ₹25,000 assumed for simplicity.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Home Loan Interest (Section 24(b))
                </label>
                <input
                  type="number"
                  value={dedHomeLoan}
                  onChange={(e) => setDedHomeLoan(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Up to ₹2,00,000"
                  min={0}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Self-occupied property interest capped at ₹2,00,000.
                </p>
              </div>
            </>
          )}

          {/* Generic deductions */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {country === 'india'
                ? 'Other Deductions'
                : 'Total Deductions (standard/itemized)'}
            </label>
            <input
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={
                country === 'us'
                  ? 'e.g. standard deduction or itemized deductions'
                  : 'Enter other eligible deductions (optional)'
              }
              min={0}
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
            <h3 className="text-lg font-medium text-gray-900">
              Tax Summary {country === 'india' && `(${indiaRegime.toUpperCase()} regime)`}
            </h3>
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

            {country === 'india' && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Tax Slabs ({indiaRegime === 'new' ? 'New Regime (approx.)' : 'Old Regime (approx.)'})
                </h4>
                {indiaRegime === 'new' ? (
              <ul className="text-sm text-blue-700 space-y-1">
                    <li>Up to ₹3L: 0%</li>
                    <li>₹3L to ₹7L: 5%</li>
                    <li>₹7L to ₹10L: 10%</li>
                    <li>₹10L to ₹12L: 15%</li>
                    <li>₹12L to ₹15L: 20%</li>
                <li>Above ₹15L: 30%</li>
                    <li>Section 87A rebate: Effective tax is 0 up to ₹7L of taxable income.</li>
                    <li>* Additional 4% Health & Education Cess on tax payable.</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>Up to ₹2,50,000: Nil</li>
                    <li>₹2,50,001 to ₹5,00,000: 5% above ₹2,50,000</li>
                    <li>₹5,00,001 to ₹10,00,000: ₹12,500 + 20% above ₹5,00,000</li>
                    <li>Above ₹10,00,000: ₹1,12,500 + 30% above ₹10,00,000</li>
                    <li>* Additional 4% Health & Education Cess on tax payable.</li>
                    <li className="mt-1">
                      * Surcharge may apply at higher income levels (10% & above). This calculator currently
                      ignores surcharge and uses slab rates + cess only.
                    </li>
              </ul>
                )}
            </div>
            )}
          </div>
        )}
      </div>

      {/* India comparison block */}
      {country === 'india' && indiaComparison && (
        <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-3">
            India: Old vs New Regime (Comparison)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-md border ${indiaComparison.recommended === 'old' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <h4 className="text-sm font-medium text-gray-900 flex justify-between">
                <span>Old Regime</span>
                {indiaComparison.recommended === 'old' && (
                  <span className="text-xs text-green-700 font-semibold">Recommended</span>
                )}
              </h4>
              <p className="mt-2 text-sm text-gray-600">Tax Amount</p>
              <p className="text-lg font-semibold text-indigo-600">
                {formatCurrency(indiaComparison.old.taxAmount)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Effective rate: {indiaComparison.old.effectiveTaxRate.toFixed(2)}%
              </p>
            </div>

            <div className={`p-4 rounded-md border ${indiaComparison.recommended === 'new' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
              <h4 className="text-sm font-medium text-gray-900 flex justify-between">
                <span>New Regime</span>
                {indiaComparison.recommended === 'new' && (
                  <span className="text-xs text-green-700 font-semibold">Recommended</span>
                )}
              </h4>
              <p className="mt-2 text-sm text-gray-600">Tax Amount</p>
              <p className="text-lg font-semibold text-indigo-600">
                {formatCurrency(indiaComparison.new.taxAmount)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Effective rate: {indiaComparison.new.effectiveTaxRate.toFixed(2)}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            This calculator provides an approximate comparison for India&apos;s old and new income tax regimes.
            Actual tax liability can vary based on additional rules and surcharges. Please consult a tax
            professional for personalized advice.
          </p>
        </div>
      )}

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 