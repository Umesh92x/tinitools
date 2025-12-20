'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

export function EpochConverter() {
  const [timestamp, setTimestamp] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isMilliseconds, setIsMilliseconds] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

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

      setDate(dateObj.toISOString().split('T')[0])
      setTime(dateObj.toISOString().split('T')[1].substring(0, 5))
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
      const dateObj = new Date(`${date}T${time}`)
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date/time')
      }

      const epochTime = dateObj.getTime()
      setTimestamp(isMilliseconds ? epochTime.toString() : Math.floor(epochTime / 1000).toString())
    } catch (error) {
      setToastMessage('Invalid date/time format')
      setToastType('error')
      setShowToast(true)
    }
  }

  const getCurrentTimestamp = () => {
    const now = new Date()
    setTimestamp(isMilliseconds ? now.getTime().toString() : Math.floor(now.getTime() / 1000).toString())
    setDate(now.toISOString().split('T')[0])
    setTime(now.toISOString().split('T')[1].substring(0, 5))
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
                  3. Click "Convert" to see the date and time
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Date to Timestamp</h4>
                <p className="text-sm text-gray-600">
                  1. Select a date and time
                  <br />
                  2. Click "Convert to Timestamp"
                  <br />
                  3. Use "Now" to get current date/time
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