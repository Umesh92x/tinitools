'use client'

import { useState, useEffect, useRef } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface Lap {
  time: number
  lapNumber: number
}

export function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - pausedTimeRef.current
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10) // Update every 10ms for smooth display
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
  }, [isRunning])

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const centiseconds = Math.floor((milliseconds % 1000) / 10)
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`
  }

  const toggleStopwatch = () => {
    if (isRunning) {
      pausedTimeRef.current = time
    }
    setIsRunning(!isRunning)
  }

  const resetStopwatch = () => {
    setIsRunning(false)
    setTime(0)
    setLaps([])
    pausedTimeRef.current = 0
    setToastMessage('Stopwatch reset')
    setShowToast(true)
  }

  const recordLap = () => {
    if (!isRunning && time === 0) return
    
    const newLap: Lap = {
      time: time,
      lapNumber: laps.length + 1,
    }
    setLaps(prev => [newLap, ...prev])
    setToastMessage(`Lap ${newLap.lapNumber} recorded: ${formatTime(time)}`)
    setShowToast(true)
  }

  const getLapTime = (lap: Lap, previousLap?: Lap) => {
    if (!previousLap) return formatTime(lap.time)
    return formatTime(lap.time - previousLap.time)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center">
              <div className="text-7xl font-mono font-bold text-indigo-600 mb-6">
                {formatTime(time)}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleStopwatch}
                  className={`px-8 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRunning
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  }`}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={recordLap}
                  disabled={!isRunning && time === 0}
                  className="px-8 py-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lap
                </button>
                <button
                  onClick={resetStopwatch}
                  className="px-8 py-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {laps.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lap Times</h3>
              <div className="bg-white p-4 rounded-md max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {laps.map((lap, index) => {
                    const previousLap = index < laps.length - 1 ? laps[index + 1] : undefined
                    return (
                      <div
                        key={lap.lapNumber}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Lap {lap.lapNumber}</span>
                          <span className="text-xs text-gray-500">
                            {getLapTime(lap, previousLap)}
                          </span>
                        </div>
                        <span className="text-sm font-mono font-medium text-indigo-600">
                          {formatTime(lap.time)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Start/Stop</h4>
                <p className="text-sm text-gray-600">
                  Click "Start" to begin timing. Click "Pause" to pause the stopwatch.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Record Laps</h4>
                <p className="text-sm text-gray-600">
                  Click "Lap" while running to record lap times without stopping the timer.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Reset</h4>
                <p className="text-sm text-gray-600">
                  Click "Reset" to clear the timer and all lap times.
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

