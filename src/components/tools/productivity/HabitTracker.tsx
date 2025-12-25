'use client'

import { useState, useEffect, useCallback } from 'react'
import { PlusIcon, TrashIcon, CheckIcon, XIcon, CalendarIcon, TrendingUpIcon, TargetIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Habit {
  id: string
  name: string
  streak: number
  longestStreak: number
  lastChecked: string | null
  createdAt: string
  goal: number // Days per week
  checkedDates: string[] // Array of ISO date strings
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabit, setNewHabit] = useState('')
  const [newGoal, setNewGoal] = useState(7)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits))
      } catch (error) {
        console.error('Error loading habits:', error)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits))
    } catch (error) {
      console.error('Error saving habits:', error)
    }
  }, [habits])

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabit.trim()) {
      showMessage('Please enter a habit name', 'error')
      return
    }

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      streak: 0,
      longestStreak: 0,
      lastChecked: null,
      createdAt: new Date().toISOString(),
      goal: newGoal,
      checkedDates: [],
    }

    setHabits([habit, ...habits])
    setNewHabit('')
    setNewGoal(7)
    showMessage('Habit added successfully!')
  }

  const handleCheckHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    
    setHabits(habits.map((habit) => {
      if (habit.id === id) {
        const lastCheckedDate = habit.lastChecked?.split('T')[0]
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        // If already checked today, uncheck it
        if (lastCheckedDate === today) {
          const newCheckedDates = habit.checkedDates.filter(d => d !== today)
          return {
            ...habit,
            lastChecked: newCheckedDates.length > 0 ? newCheckedDates[newCheckedDates.length - 1] : null,
            checkedDates: newCheckedDates,
            streak: 0, // Recalculate streak
          }
        }

        // If never checked or checked yesterday, increment streak
        let newStreak = habit.streak
        if (!habit.lastChecked || lastCheckedDate === yesterdayStr) {
          newStreak = habit.streak + 1
        } else {
          // If streak broken, reset to 1
          newStreak = 1
        }

        const newCheckedDates = [...habit.checkedDates, today]
        const longestStreak = Math.max(habit.longestStreak, newStreak)

        return {
          ...habit,
          streak: newStreak,
          longestStreak,
          lastChecked: today,
          checkedDates: newCheckedDates,
        }
      }
      return habit
    }))
  }

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id))
    showMessage('Habit deleted successfully!')
  }

  const isCheckedToday = (lastChecked: string | null) => {
    if (!lastChecked) return false
    const today = new Date().toISOString().split('T')[0]
    return lastChecked.split('T')[0] === today
  }

  const getWeekStats = (habit: Habit) => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    weekStart.setHours(0, 0, 0, 0)

    const weekDates = habit.checkedDates.filter(date => {
      const checkDate = new Date(date)
      return checkDate >= weekStart
    })

    return {
      checked: weekDates.length,
      goal: habit.goal,
      percentage: Math.round((weekDates.length / habit.goal) * 100),
    }
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <form onSubmit={handleAddHabit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Add a new habit..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal: {newGoal} days per week
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={newGoal}
                onChange={(e) => setNewGoal(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 day</span>
                <span>7 days</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Habit
            </button>
          </form>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 text-sm rounded-md ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 px-3 py-2 text-sm rounded-md ${
                  viewMode === 'calendar'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Calendar View
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {habits.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{habits.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Total Habits</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {habits.filter(h => isCheckedToday(h.lastChecked)).length}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Checked Today</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {Math.max(...habits.map(h => h.streak), 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Longest Streak</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {habits.reduce((sum, h) => sum + h.checkedDates.length, 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Total Checks</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-2">
          {habits.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
              No habits added yet. Start by adding a new habit above.
            </div>
          ) : (
            habits.map((habit) => {
              const weekStats = getWeekStats(habit)
              const checkedToday = isCheckedToday(habit.lastChecked)

              return (
                <div
                  key={habit.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCheckHabit(habit.id)}
                      className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        checkedToday
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {checkedToday ? (
                        <CheckIcon className="h-5 w-5 text-white" />
                      ) : (
                        <XIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{habit.name}</h3>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <TrendingUpIcon className="h-4 w-4 text-indigo-600" />
                            <span className="text-gray-700">
                              <strong>{habit.streak}</strong> day streak
                            </span>
                          </div>
                          {habit.longestStreak > 0 && (
                            <div className="text-gray-500">
                              Best: {habit.longestStreak} days
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <TargetIcon className="h-4 w-4 text-gray-400" />
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>This week: {weekStats.checked}/{weekStats.goal}</span>
                              <span>{weekStats.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  weekStats.percentage >= 100
                                    ? 'bg-green-600'
                                    : weekStats.percentage >= 50
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(weekStats.percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Last 7 Days</h3>
          <div className="space-y-4">
            {habits.map((habit) => {
              const last7Days = getLast7Days()
              return (
                <div key={habit.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{habit.name}</h4>
                    <span className="text-sm text-gray-600">
                      {habit.streak} day streak
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {last7Days.map((date) => {
                      const isChecked = habit.checkedDates.includes(date)
                      const dateObj = new Date(date)
                      const isToday = date === new Date().toISOString().split('T')[0]
                      
                      return (
                        <div
                          key={date}
                          className={`flex-1 text-center p-2 rounded ${
                            isChecked
                              ? 'bg-green-100 border-2 border-green-500'
                              : 'bg-gray-100 border-2 border-transparent'
                          } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                          title={dateObj.toLocaleDateString()}
                        >
                          <div className="text-xs text-gray-600 mb-1">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-xs font-medium">
                            {dateObj.getDate()}
                          </div>
                          {isChecked && (
                            <CheckIcon className="h-3 w-3 text-green-600 mx-auto mt-1" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
