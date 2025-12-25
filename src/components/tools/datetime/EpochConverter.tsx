'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

export function EpochConverter() {
  const [timestamp, setTimestamp] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isMilliseconds, setIsMilliseconds] = useState(false)
  const [useUtc, setUseUtc] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const applyDateTimeFromDate = (dateObj: Date) => {
    if (useUtc) {
      const iso = dateObj.toISOString()
      setDate(iso.split('T')[0])
      setTime(iso.split('T')[1].substring(0, 5))
    } else {
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const day = String(dateObj.getDate()).padStart(2, '0')
      const hours = String(dateObj.getHours()).padStart(2, '0')
      const minutes = String(dateObj.getMinutes()).padStart(2, '0')
      setDate(`${year}-${month}-${day}`)
      setTime(`${hours}:${minutes}`)
    }
  }

  const parseDateTimeToMs = () => {
    const [y, m, d] = date.split('-').map(Number)
    const [hh, mm] = time.split(':').map(Number)

    if ([y, m, d, hh, mm].some((v) => Number.isNaN(v))) {
      throw new Error('Invalid date/time')
    }

    if (useUtc) {
      return Date.UTC(y, m - 1, d, hh, mm)
    }

    return new Date(y, m - 1, d, hh, mm).getTime()
  }

  const convertToDate = () => {
    if (!timestamp.trim()) {
      setToastMessage('Please enter a timestamp')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const epochTime = parseInt(timestamp)
      if (isNaN(epochTime)) {
        throw new Error('Invalid timestamp')
      }

      const dateObj = new Date(isMilliseconds ? epochTime : epochTime * 1000)
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid timestamp')
      }

      applyDateTimeFromDate(dateObj)
      setToastMessage('Timestamp converted to date/time.')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Invalid timestamp format')
      setToastType('error')
      setShowToast(true)
    }
  }

  const convertToTimestamp = () => {
    if (!date || !time) {
      setToastMessage('Please select both date and time')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const ms = parseDateTimeToMs()
      const epochTime = ms
      setTimestamp(
        isMilliseconds ? epochTime.toString() : Math.floor(epochTime / 1000).toString(),
      )
      setToastMessage('Date/time converted to timestamp.')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Invalid date/time format')
      setToastType('error')
      setShowToast(true)
    }
  }

  const getCurrentTimestamp = () => {
    const now = new Date()
    setTimestamp(
      isMilliseconds ? now.getTime().toString() : Math.floor(now.getTime() / 1000).toString(),
    )
    applyDateTimeFromDate(now)
    setToastMessage('Filled current time.')
    setToastType('success')
    setShowToast(true)
  }

  const handleCopyTimestamp = async () => {
    if (!timestamp.trim()) {
      setToastMessage('Nothing to copy. Generate or enter a timestamp first.')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      await navigator.clipboard.writeText(timestamp)
      setToastMessage('Timestamp copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch {
      setToastMessage('Failed to copy timestamp.')
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleCopyIso = async () => {
    if (!date || !time) {
      setToastMessage('Please select date and time to copy as ISO.')
      setToastType('error')
      setShowToast(true)
      return
    }

    try {
      const ms = parseDateTimeToMs()
      const iso = new Date(ms).toISOString()
      await navigator.clipboard.writeText(iso)
      setToastMessage('ISO 8601 date-time copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch {
      setToastMessage('Failed to copy ISO string.')
      setToastType('error')
      setShowToast(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unix Timestamp
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder={isMilliseconds ? '1609459200000' : '1609459200'}
                  className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  onClick={convertToDate}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Convert
                </button>
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isMilliseconds}
                    onChange={(e) => setIsMilliseconds(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Use milliseconds
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={convertToTimestamp}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Convert to Timestamp
                </button>
                <button
                  onClick={getCurrentTimestamp}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Now
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleCopyTimestamp}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Copy Timestamp
                </button>
                <button
                  type="button"
                  onClick={handleCopyIso}
                  className="flex-1 bg-emerald-600 text-white px-3 py-2 rounded-md text-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Copy ISO Date-Time
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Timestamp to Date</h4>
                <p className="text-sm text-gray-600">
                  1. Enter a Unix timestamp (seconds or milliseconds)
                  <br />
                  2. Toggle "Use milliseconds" if needed
                  <br />
                  3. Choose whether to interpret as UTC or local time
                  <br />
                  4. Click "Convert" to see the date and time
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Date to Timestamp</h4>
                <p className="text-sm text-gray-600">
                  1. Select a date and time
                  <br />
                  2. Choose UTC vs local interpretation
                  <br />
                  3. Click "Convert to Timestamp"
                  <br />
                  4. Use "Now" to get current date/time
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Examples</h4>
                <p className="text-sm text-gray-600">
                  Seconds: 1609459200
                  <br />
                  Milliseconds: 1609459200000
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Settings
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={useUtc}
                  onChange={() => setUseUtc(true)}
                />
                <span className="ml-2">
                  Use UTC for conversions (recommended for backend and API work)
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={!useUtc}
                  onChange={() => setUseUtc(false)}
                />
                <span className="ml-2">Use local browser time zone</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Common Timestamps
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Unix Epoch Start: 0 (Jan 1, 1970)</p>
              <p>Y2K: 946684800 (Jan 1, 2000)</p>
              <p>1 Billion: 1000000000 (Sep 9, 2001)</p>
              <p>2 Billion: 2000000000 (May 18, 2033)</p>
            </div>
          </div>
        </div>
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