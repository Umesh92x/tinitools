'use client'

import { useState } from 'react'
import { CalendarDaysIcon, PrinterIcon } from '@heroicons/react/24/outline'

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
}

export function CalendarGenerator() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [view, setView] = useState<'month' | 'year'>('month')
  const [showWeekNumbers, setShowWeekNumbers] = useState(false)
  const [startWeekOn, setStartWeekOn] = useState<'sunday' | 'monday'>('sunday')

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getWeekNumber = (date: Date) => {
    const target = new Date(date.valueOf())
    const dayNr = (date.getDay() + 6) % 7
    target.setDate(target.getDate() - dayNr + 3)
    const firstThursday = target.valueOf()
    target.setMonth(0, 1)
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
  }

  const generateMonthDays = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: CalendarDay[] = []
    const today = new Date()

    // Previous month days
    const firstDayOfWeek = startWeekOn === 'sunday' ? firstDay.getDay() : (firstDay.getDay() + 6) % 7
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false
      })
    }

    // Current month days
    for (let date = 1; date <= lastDay.getDate(); date++) {
      days.push({
        date,
        isCurrentMonth: true,
        isToday: 
          date === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
      })
    }

    // Next month days
    const remainingDays = 42 - days.length // Always show 6 weeks
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false
      })
    }

    return days
  }

  const renderMonth = (year: number, month: number) => {
    const days = generateMonthDays(year, month)
    const weekDays = startWeekOn === 'sunday' 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {months[month]} {year}
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {weekDays.map((day, i) => (
              <div key={i} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                {day}
              </div>
            ))}
            {days.map((day, i) => {
              const date = new Date(year, month, day.date)
              return (
                <div
                  key={i}
                  className={`
                    relative bg-white p-2 text-center text-sm
                    ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                    ${day.isToday ? 'bg-indigo-50 font-semibold text-indigo-600' : ''}
                  `}
                >
                  <time dateTime={date.toISOString().split('T')[0]}>
                    {day.date}
                  </time>
                  {showWeekNumbers && i % 7 === 0 && (
                    <span className="absolute left-0 top-0 -translate-x-full px-2 text-xs text-gray-500">
                      {getWeekNumber(date)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="1900"
              max="2100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          {view === 'month' && (
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {months.map((name, index) => (
                  <option key={index} value={index}>{name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="month"
                  checked={view === 'month'}
                  onChange={(e) => setView(e.target.value as 'month' | 'year')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Monthly View</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="year"
                  checked={view === 'year'}
                  onChange={(e) => setView(e.target.value as 'month' | 'year')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yearly View</span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showWeekNumbers}
                  onChange={(e) => setShowWeekNumbers(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Week Numbers</span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="sunday"
                  checked={startWeekOn === 'sunday'}
                  onChange={(e) => setStartWeekOn(e.target.value as 'sunday' | 'monday')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Start on Sunday</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="monday"
                  checked={startWeekOn === 'monday'}
                  onChange={(e) => setStartWeekOn(e.target.value as 'sunday' | 'monday')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Start on Monday</span>
              </label>
            </div>
          </div>
          <div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print Calendar
            </button>
          </div>
        </div>
      </div>

      <div className={`space-y-8 print:block ${view === 'year' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}`}>
        {view === 'year'
          ? Array.from({ length: 12 }, (_, i) => renderMonth(year, i))
          : renderMonth(year, month)
        }
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  )
} 