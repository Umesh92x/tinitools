'use client'

import { useState, useEffect, useRef } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

export function CountdownTimer() {
  const [hours, setHours] = useState('0')
  const [minutes, setMinutes] = useState('5')
  const [seconds, setSeconds] = useState('0')
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            if (Notification.permission === 'granted') {
              new Notification('Countdown Timer', { body: 'Time is up!' })
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const setTimer = () => {
    const hrs = parseInt(hours) || 0
    const mins = parseInt(minutes) || 0
    const secs = parseInt(seconds) || 0
    const total = hrs * 3600 + mins * 60 + secs
    
    if (total <= 0) {
      setToastMessage('Please set a valid time')
      setShowToast(true)
      return
    }
    
    setTimeLeft(total)
    setIsComplete(false)
    setIsRunning(false)
  }

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimer()
      return
    }
    setIsRunning(!isRunning)
    setIsComplete(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsComplete(false)
    setTimeLeft(0)
    setToastMessage('Timer reset')
    setShowToast(true)
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setToastMessage('Notifications not supported')
      setShowToast(true)
      return
    }

    const permission = await Notification.requestPermission()
    setToastMessage(permission === 'granted' ? 'Notifications enabled' : 'Notifications disabled')
    setShowToast(true)
  }

  const quickPresets = [
    { label: '1 min', hours: 0, minutes: 1, seconds: 0 },
    { label: '5 min', hours: 0, minutes: 5, seconds: 0 },
    { label: '10 min', hours: 0, minutes: 10, seconds: 0 },
    { label: '15 min', hours: 0, minutes: 15, seconds: 0 },
    { label: '30 min', hours: 0, minutes: 30, seconds: 0 },
    { label: '1 hour', hours: 1, minutes: 0, seconds: 0 },
  ]

  const applyPreset = (preset: typeof quickPresets[0]) => {
    setHours(preset.hours.toString())
    setMinutes(preset.minutes.toString())
    setSeconds(preset.seconds.toString())
    setTimeLeft(preset.hours * 3600 + preset.minutes * 60 + preset.seconds)
    setIsComplete(false)
    setIsRunning(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center">
              <div className={`text-7xl font-mono font-bold mb-6 ${
                isComplete ? 'text-red-600 animate-pulse' : timeLeft === 0 ? 'text-gray-400' : 'text-indigo-600'
              }`}>
                {timeLeft > 0 ? formatTime(timeLeft) : formatTime(
                  (parseInt(hours) || 0) * 3600 + 
                  (parseInt(minutes) || 0) * 60 + 
                  (parseInt(seconds) || 0)
                )}
              </div>
              
              {isComplete && (
                <div className="mb-4 text-xl font-medium text-red-600">
                  Time's Up!
                </div>
              )}

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={toggleTimer}
                  className={`px-8 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRunning
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  }`}
                >
                  {isRunning ? 'Pause' : timeLeft === 0 ? 'Start' : 'Resume'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-8 py-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hours
                </label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0"
                  max="99"
                  disabled={isRunning}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minutes
                </label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  min="0"
                  max="59"
                  disabled={isRunning}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seconds
                </label>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  min="0"
                  max="59"
                  disabled={isRunning}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <button
              onClick={setTimer}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Set Timer
            </button>

            <button
              onClick={requestNotificationPermission}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Enable Notifications
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Set Time</h4>
                <p className="text-sm text-gray-600">
                  Use quick presets or manually enter hours, minutes, and seconds.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Start Timer</h4>
                <p className="text-sm text-gray-600">
                  Click "Start" to begin the countdown. The timer will notify you when time is up.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Pause/Reset</h4>
                <p className="text-sm text-gray-600">
                  Pause the timer anytime or reset to start over with a new time.
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
        type="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

