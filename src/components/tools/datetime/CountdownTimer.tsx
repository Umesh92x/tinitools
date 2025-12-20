'use client'

import { useState, useEffect } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [eventName, setEventName] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [targetTime, setTargetTime] = useState('')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isRunning, setIsRunning] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning) {
      intervalId = setInterval(() => {
        const target = new Date(`${targetDate}T${targetTime}`)
        const now = new Date()
        const difference = target.getTime() - now.getTime()

        if (difference <= 0) {
          setIsRunning(false)
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
          setToastMessage('Countdown completed!')
          setToastType('success')
          setShowToast(true)
          return
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / (1000 * 60)) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      }, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning, targetDate, targetTime])

  const startCountdown = () => {
    if (!eventName.trim()) {
      setToastMessage('Please enter an event name')
      setToastType('error')
      setShowToast(true)
      return
    }

    if (!targetDate || !targetTime) {
      setToastMessage('Please select both date and time')
      setToastType('error')
      setShowToast(true)
      return
    }

    const target = new Date(`${targetDate}T${targetTime}`)
    const now = new Date()

    if (target <= now) {
      setToastMessage('Please select a future date and time')
      setToastType('error')
      setShowToast(true)
      return
    }

    setIsRunning(true)
  }

  const stopCountdown = () => {
    setIsRunning(false)
  }

  const resetCountdown = () => {
    setIsRunning(false)
    setEventName('')
    setTargetDate('')
    setTargetTime('')
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex space-x-2">
              {!isRunning ? (
                <button
                  onClick={startCountdown}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Start Countdown
                </button>
              ) : (
                <button
                  onClick={stopCountdown}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Stop
                </button>
              )}
              <button
                onClick={resetCountdown}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {eventName || 'Countdown Timer'}
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {formatNumber(timeLeft.days)}
                </div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className="text-sm text-gray-500">Hours</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-indigo-600">
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className="text-sm text-gray-500">Seconds</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Set Event Details</h4>
                <p className="text-sm text-gray-600">
                  Enter your event name and select the target date and time.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Start Countdown</h4>
                <p className="text-sm text-gray-600">
                  Click "Start Countdown" to begin. The timer will update in real-time.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Control Options</h4>
                <p className="text-sm text-gray-600">
                  Use Stop to pause the countdown, and Reset to clear all fields.
                </p>
              </div>
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