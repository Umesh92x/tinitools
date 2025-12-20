'use client'

import { useState } from 'react'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'

interface Duration {
  years: number
  months: number
  days: number
  totalDays: number
  totalMonths: number
  totalWeeks: number
  hours: number
  minutes: number
}

export function DateDurationCalculator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [includeTime, setIncludeTime] = useState(false)
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('00:00')

  const calculateDuration = (): Duration | null => {
    if (!startDate || !endDate) return null

    const start = new Date(`${startDate}${includeTime ? `T${startTime}` : ''}`)
    const end = new Date(`${endDate}${includeTime ? `T${endTime}` : ''}`)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = Math.floor(totalDays / 30.44) // Average month length

    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()
    let hours = includeTime ? end.getHours() - start.getHours() : 0
    let minutes = includeTime ? end.getMinutes() - start.getMinutes() : 0

    if (minutes < 0) {
      hours -= 1
      minutes += 60
    }
    if (hours < 0) {
      days -= 1
      hours += 24
    }
    if (days < 0) {
      months -= 1
      // Get last day of previous month
      const tempDate = new Date(end.getFullYear(), end.getMonth(), 0)
      days += tempDate.getDate()
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    return {
      years,
      months,
      days,
      totalDays,
      totalMonths,
      totalWeeks,
      hours,
      minutes
    }
  }

  const duration = calculateDuration()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {includeTime && (
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {includeTime && (
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}
          </div>
          <div className="flex items-center">
            <input
              id="includeTime"
              type="checkbox"
              checked={includeTime}
              onChange={(e) => setIncludeTime(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="includeTime" className="ml-2 block text-sm text-gray-900">
              Include time in calculation
            </label>
          </div>
        </div>

        {duration && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Duration</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Precise:</span>{' '}
                {duration.years > 0 && `${duration.years} years, `}
                {duration.months > 0 && `${duration.months} months, `}
                {duration.days} days
                {includeTime && (
                  <span>
                    , {duration.hours} hours, {duration.minutes} minutes
                  </span>
                )}
              </p>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Days:</span> {duration.totalDays}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Weeks:</span> {duration.totalWeeks}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Months:</span> {Math.round(duration.totalMonths * 10) / 10}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 