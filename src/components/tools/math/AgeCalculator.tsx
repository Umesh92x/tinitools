'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface AgeResult {
  years: number
  months: number
  days: number
  totalMonths: number
  totalWeeks: number
  totalDays: number
  nextBirthday: Date
  daysUntilNextBirthday: number
}

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])
  const [result, setResult] = useState<AgeResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const calculateAge = () => {
    try {
      if (!birthDate || !toDate) {
        throw new Error('Please select both dates')
      }

      const birth = new Date(birthDate)
      const end = new Date(toDate)

      if (birth > end) {
        throw new Error('Birth date cannot be in the future')
      }

      let years = end.getFullYear() - birth.getFullYear()
      let months = end.getMonth() - birth.getMonth()
      let days = end.getDate() - birth.getDate()

      // Adjust for negative days
      if (days < 0) {
        months--
        const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0)
        days += lastMonth.getDate()
      }

      // Adjust for negative months
      if (months < 0) {
        years--
        months += 12
      }

      // Calculate total values
      const totalDays = Math.floor((end.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
      const totalWeeks = Math.floor(totalDays / 7)
      const totalMonths = years * 12 + months

      // Calculate next birthday
      const nextBirthday = new Date(end.getFullYear(), birth.getMonth(), birth.getDate())
      if (nextBirthday < end) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
      }
      const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - end.getTime()) / (1000 * 60 * 60 * 24))

      setResult({
        years,
        months,
        days,
        totalMonths,
        totalWeeks,
        totalDays,
        nextBirthday,
        daysUntilNextBirthday,
      })

      setToastMessage('Age calculated successfully')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setResult(null)
      setToastMessage(error instanceof Error ? error.message : 'Invalid input')
      setToastType('error')
      setShowToast(true)
    }
  }

  const resetCalculator = () => {
    setBirthDate('')
    setToDate(new Date().toISOString().split('T')[0])
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calculate To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={calculateAge}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calculate Age
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
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              {/* Primary Age */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Age</h3>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {result.years} years, {result.months} months, {result.days} days
                </p>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Months</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {result.totalMonths.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Weeks</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {result.totalWeeks.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Days</p>
                  <p className="text-xl font-semibold text-gray-900 mt-1">
                    {result.totalDays.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Next Birthday */}
              <div className="text-center p-4 bg-white rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">Next Birthday</h4>
                <p className="text-lg text-gray-600 mt-1">
                  {result.nextBirthday.toLocaleDateString()} ({result.daysUntilNextBirthday} days from now)
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