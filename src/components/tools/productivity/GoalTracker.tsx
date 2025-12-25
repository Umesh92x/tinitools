'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, EditIcon, TargetIcon, TrendingUpIcon, CheckCircleIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Goal {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: string
  category: string
  createdAt: string
  completed: boolean
  completedAt?: string
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 100,
    currentValue: 0,
    unit: '',
    deadline: '',
    category: 'Personal',
  })
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Financial', 'Other']

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals')
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (error) {
        console.error('Error loading goals:', error)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('goals', JSON.stringify(goals))
    } catch (error) {
      console.error('Error saving goals:', error)
    }
  }, [goals])

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title.trim()) {
      showMessage('Please enter a goal title', 'error')
      return
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      targetValue: newGoal.targetValue,
      currentValue: newGoal.currentValue,
      unit: newGoal.unit.trim(),
      deadline: newGoal.deadline,
      category: newGoal.category,
      createdAt: new Date().toISOString(),
      completed: false,
    }

    setGoals([goal, ...goals])
    setNewGoal({
      title: '',
      description: '',
      targetValue: 100,
      currentValue: 0,
      unit: '',
      deadline: '',
      category: 'Personal',
    })
    showMessage('Goal added successfully!')
  }

  const handleUpdateProgress = (id: string, value: number) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === id) {
          const newValue = Math.max(0, Math.min(value, goal.targetValue))
          const isCompleted = newValue >= goal.targetValue && !goal.completed
          
          return {
            ...goal,
            currentValue: newValue,
            completed: isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : goal.completedAt,
          }
        }
        return goal
      })
    )
  }

  const handleDelete = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
    showMessage('Goal deleted!')
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      deadline: goal.deadline,
      category: goal.category,
    })
  }

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGoal || !newGoal.title.trim()) {
      showMessage('Please enter a goal title', 'error')
      return
    }

    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === editingGoal.id
          ? {
              ...goal,
              title: newGoal.title.trim(),
              description: newGoal.description.trim(),
              targetValue: newGoal.targetValue,
              unit: newGoal.unit.trim(),
              deadline: newGoal.deadline,
              category: newGoal.category,
            }
          : goal
      )
    )

    setEditingGoal(null)
    setNewGoal({
      title: '',
      description: '',
      targetValue: 100,
      currentValue: 0,
      unit: '',
      deadline: '',
      category: 'Personal',
    })
    showMessage('Goal updated successfully!')
  }

  const cancelEdit = () => {
    setEditingGoal(null)
    setNewGoal({
      title: '',
      description: '',
      targetValue: 100,
      currentValue: 0,
      unit: '',
      deadline: '',
      category: 'Personal',
    })
  }

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getDaysRemaining = (deadline: string) => {
    if (!deadline) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    const diff = deadlineDate.getTime() - today.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const activeGoals = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)
  const totalProgress = goals.length > 0
    ? Math.round((completedGoals.length / goals.length) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <form
            onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
            className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title *
              </label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="Enter goal title..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Enter goal description..."
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Value
                </label>
                <input
                  type="number"
                  min="0"
                  value={newGoal.currentValue}
                  onChange={(e) => setNewGoal({ ...newGoal, currentValue: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Value
                </label>
                <input
                  type="number"
                  min="1"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || 100 })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit (e.g., kg, pages, $)
              </label>
              <input
                type="text"
                value={newGoal.unit}
                onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                placeholder="kg, pages, $, etc."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </button>
              {editingGoal && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TargetIcon className="h-5 w-5" />
              Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{goals.length}</div>
                <div className="text-xs text-gray-600 mt-1">Total Goals</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
                <div className="text-xs text-gray-600 mt-1">Completed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{activeGoals.length}</div>
                <div className="text-xs text-gray-600 mt-1">Active</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totalProgress}%</div>
                <div className="text-xs text-gray-600 mt-1">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Goals</h3>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const progress = getProgressPercentage(goal)
              const daysRemaining = getDaysRemaining(goal.deadline)

              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {goal.category}
                        </span>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          {goal.currentValue} {goal.unit || ''} / {goal.targetValue} {goal.unit || ''}
                        </span>
                        {daysRemaining !== null && (
                          <span className={daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-yellow-600' : ''}>
                            {daysRemaining < 0
                              ? `${Math.abs(daysRemaining)} days overdue`
                              : `${daysRemaining} days remaining`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="text-indigo-600 hover:text-indigo-700"
                        title="Edit"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          progress >= 100
                            ? 'bg-green-600'
                            : progress >= 75
                            ? 'bg-indigo-600'
                            : progress >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max={goal.targetValue}
                      value={goal.currentValue}
                      onChange={(e) => handleUpdateProgress(goal.id, parseFloat(e.target.value) || 0)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      onClick={() => handleUpdateProgress(goal.id, goal.currentValue + 1)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(goal.id, goal.currentValue + 10)}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                    >
                      +10
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            Completed Goals
          </h3>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-green-50 rounded-lg border border-green-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Completed on {new Date(goal.completedAt || '').toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
          No goals yet. Add your first goal above.
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

