'use client'

import { useState, useEffect, useCallback } from 'react'
import { PlayIcon, PauseIcon, Square, PlusIcon, TrashIcon, ClockIcon, BarChartIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface TimeEntry {
  id: string
  name: string
  startTime: number | null
  elapsedTime: number
  totalTime: number
  isRunning: boolean
  category: string
  notes: string
  createdAt: string
}

export function TimeTracker() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [newEntryName, setNewEntryName] = useState('')
  const [newEntryCategory, setNewEntryCategory] = useState('Work')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const categories = ['Work', 'Personal', 'Learning', 'Exercise', 'Other']

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    const savedEntries = localStorage.getItem('timeTrackerEntries')
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries)
        setEntries(parsed.map((entry: TimeEntry) => ({
          ...entry,
          isRunning: false, // Don't restore running state
          startTime: null,
        })))
      } catch (error) {
        console.error('Error loading entries:', error)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('timeTrackerEntries', JSON.stringify(entries))
    } catch (error) {
      console.error('Error saving entries:', error)
    }
  }, [entries])

  // Update elapsed time for running entries
  useEffect(() => {
    const interval = setInterval(() => {
      setEntries(prevEntries =>
        prevEntries.map(entry => {
          if (entry.isRunning && entry.startTime) {
            return {
              ...entry,
              elapsedTime: Date.now() - entry.startTime,
            }
          }
          return entry
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEntryName.trim()) {
      showMessage('Please enter a task name', 'error')
      return
    }

    const entry: TimeEntry = {
      id: Date.now().toString(),
      name: newEntryName.trim(),
      startTime: null,
      elapsedTime: 0,
      totalTime: 0,
      isRunning: false,
      category: newEntryCategory,
      notes: '',
      createdAt: new Date().toISOString(),
    }

    setEntries([entry, ...entries])
    setNewEntryName('')
    setNewEntryCategory('Work')
    showMessage('Time entry added!')
  }

  const handleStart = (id: string) => {
    setEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === id) {
          // Stop all other entries
          if (entry.isRunning) {
            return {
              ...entry,
              isRunning: false,
              totalTime: entry.totalTime + entry.elapsedTime,
              elapsedTime: 0,
              startTime: null,
            }
          } else {
            // Stop all other running entries first
            const otherEntries = prevEntries.map(e =>
              e.id !== id && e.isRunning
                ? {
                    ...e,
                    isRunning: false,
                    totalTime: e.totalTime + e.elapsedTime,
                    elapsedTime: 0,
                    startTime: null,
                  }
                : e
            )
            // Start this entry
            return {
              ...entry,
              isRunning: true,
              startTime: Date.now(),
            }
          }
        }
        // Stop other entries if this one is starting
        if (entry.isRunning && entry.id !== id) {
          return {
            ...entry,
            isRunning: false,
            totalTime: entry.totalTime + entry.elapsedTime,
            elapsedTime: 0,
            startTime: null,
          }
        }
        return entry
      })
    )
  }

  const handleStop = (id: string) => {
    setEntries(prevEntries =>
      prevEntries.map(entry => {
        if (entry.id === id && entry.isRunning) {
          return {
            ...entry,
            isRunning: false,
            totalTime: entry.totalTime + entry.elapsedTime,
            elapsedTime: 0,
            startTime: null,
          }
        }
        return entry
      })
    )
  }

  const handleDelete = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
    showMessage('Entry deleted!')
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getTotalTime = () => {
    return entries.reduce((total, entry) => {
      const currentTime = entry.isRunning && entry.startTime
        ? entry.totalTime + (Date.now() - entry.startTime)
        : entry.totalTime + entry.elapsedTime
      return total + currentTime
    }, 0)
  }

  const getCategoryStats = () => {
    const stats: Record<string, number> = {}
    entries.forEach(entry => {
      const currentTime = entry.isRunning && entry.startTime
        ? entry.totalTime + (Date.now() - entry.startTime)
        : entry.totalTime + entry.elapsedTime
      stats[entry.category] = (stats[entry.category] || 0) + currentTime
    })
    return stats
  }

  const categoryStats = getCategoryStats()
  const totalTime = getTotalTime()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <form onSubmit={handleAddEntry} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name
              </label>
              <input
                type="text"
                value={newEntryName}
                onChange={(e) => setNewEntryName(e.target.value)}
                placeholder="Enter task name..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newEntryCategory}
                onChange={(e) => setNewEntryCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Time Entry
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Total Time
            </h3>
            <div className="text-3xl font-bold text-indigo-600">
              {formatTime(totalTime)}
            </div>
          </div>

          {Object.keys(categoryStats).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChartIcon className="h-5 w-5" />
                Time by Category
              </h3>
              <div className="space-y-2">
                {Object.entries(categoryStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, time]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{category}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatTime(time)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {entries.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
            No time entries yet. Add your first entry above.
          </div>
        ) : (
          entries.map((entry) => {
            const currentTime = entry.isRunning && entry.startTime
              ? entry.totalTime + (Date.now() - entry.startTime)
              : entry.totalTime + entry.elapsedTime

            return (
              <div
                key={entry.id}
                className={`bg-white rounded-lg border p-4 ${
                  entry.isRunning ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{entry.name}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {entry.category}
                      </span>
                      {entry.isRunning && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded animate-pulse">
                          Running
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                      <ClockIcon className="h-5 w-5" />
                      {formatTime(currentTime)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStart(entry.id)}
                      className={`p-2 rounded-md ${
                        entry.isRunning
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={entry.isRunning ? 'Pause' : 'Start'}
                    >
                      {entry.isRunning ? (
                        <PauseIcon className="h-5 w-5" />
                      ) : (
                        <PlayIcon className="h-5 w-5" />
                      )}
                    </button>
                    {entry.isRunning && (
                      <button
                        onClick={() => handleStop(entry.id)}
                        className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                        title="Stop"
                      >
                        <Square className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
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

