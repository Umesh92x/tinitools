'use client'

import { useState, useEffect } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface TimerSettings {
  work: number
  shortBreak: number
  longBreak: number
  longBreakInterval: number
}

export function PomodoroTimer() {
  const [settings, setSettings] = useState<TimerSettings>({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  })

  const [timeLeft, setTimeLeft] = useState(settings.work * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [completedSessions, setCompletedSessions] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete()
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    
    if (mode === 'work') {
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)
      
      if (newCompletedSessions % settings.longBreakInterval === 0) {
        setMode('longBreak')
        setTimeLeft(settings.longBreak * 60)
        setToastMessage('Time for a long break!')
      } else {
        setMode('shortBreak')
        setTimeLeft(settings.shortBreak * 60)
        setToastMessage('Time for a short break!')
      }
    } else {
      setMode('work')
      setTimeLeft(settings.work * 60)
      setToastMessage('Time to focus!')
    }

    setToastType('success')
    setShowToast(true)
    
    // Request notification permission and show notification
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', { body: toastMessage })
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setMode('work')
    setTimeLeft(settings.work * 60)
    setCompletedSessions(0)
    setToastMessage('Timer reset')
    setToastType('success')
    setShowToast(true)
  }

  const updateSettings = (key: keyof TimerSettings, value: string) => {
    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue < 1) return

    setSettings((prev) => ({ ...prev, [key]: numValue }))
    
    if (!isRunning) {
      if (mode === 'work' && key === 'work') {
        setTimeLeft(numValue * 60)
      } else if (mode === 'shortBreak' && key === 'shortBreak') {
        setTimeLeft(numValue * 60)
      } else if (mode === 'longBreak' && key === 'longBreak') {
        setTimeLeft(numValue * 60)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setToastMessage('Notifications not supported')
      setToastType('error')
      setShowToast(true)
      return
    }

    const permission = await Notification.requestPermission()
    setToastMessage(permission === 'granted' ? 'Notifications enabled' : 'Notifications disabled')
    setToastType(permission === 'granted' ? 'success' : 'error')
    setShowToast(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-600 mb-4">
                {formatTime(timeLeft)}
              </div>
              <div className="text-lg font-medium text-gray-700 capitalize mb-6">
                {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleTimer}
                className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isRunning
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                }`}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Completed Sessions: {completedSessions}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work Minutes
                </label>
                <input
                  type="number"
                  value={settings.work}
                  onChange={(e) => updateSettings('work', e.target.value)}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short Break
                </label>
                <input
                  type="number"
                  value={settings.shortBreak}
                  onChange={(e) => updateSettings('shortBreak', e.target.value)}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Long Break
                </label>
                <input
                  type="number"
                  value={settings.longBreak}
                  onChange={(e) => updateSettings('longBreak', e.target.value)}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Long Break After
                </label>
                <input
                  type="number"
                  value={settings.longBreakInterval}
                  onChange={(e) => updateSettings('longBreakInterval', e.target.value)}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Enable Notifications
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Set Your Timer</h4>
                <p className="text-sm text-gray-600">
                  Customize work duration and break intervals in the settings.
                  Default is 25 minutes work, 5 minutes short break.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Start Working</h4>
                <p className="text-sm text-gray-600">
                  Click Start to begin your focus session. The timer will count down
                  and notify you when it's time for a break.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Take Breaks</h4>
                <p className="text-sm text-gray-600">
                  After each work session, take a short break. A longer break follows
                  after completing multiple sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              About the Pomodoro Technique
            </h3>
            <p className="text-sm text-gray-600">
              The Pomodoro Technique is a time management method that uses a timer
              to break work into focused intervals, traditionally 25 minutes in length,
              separated by short breaks. After a set number of work sessions,
              take a longer break to recharge.
            </p>
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