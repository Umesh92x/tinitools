'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon, CalculatorIcon, TrendingUpIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface GradeItem {
  id: string
  name: string
  score: number
  maxScore: number
  weight: number
}

export function GradeCalculator() {
  const [items, setItems] = useState<GradeItem[]>([])
  const [newItem, setNewItem] = useState({ name: '', score: '', maxScore: '', weight: '' })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const addItem = () => {
    if (!newItem.name || !newItem.score || !newItem.maxScore || !newItem.weight) {
      showMessage('Please fill in all fields', 'error')
      return
    }

    const score = parseFloat(newItem.score)
    const maxScore = parseFloat(newItem.maxScore)
    const weight = parseFloat(newItem.weight)

    if (isNaN(score) || isNaN(maxScore) || isNaN(weight) || maxScore <= 0 || weight <= 0) {
      showMessage('Please enter valid numbers', 'error')
      return
    }

    if (score > maxScore) {
      showMessage('Score cannot be greater than max score', 'error')
      return
    }

    const item: GradeItem = {
      id: Date.now().toString(),
      name: newItem.name,
      score,
      maxScore,
      weight,
    }

    setItems([...items, item])
    setNewItem({ name: '', score: '', maxScore: '', weight: '' })
    showMessage('Grade item added!')
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
    showMessage('Grade item removed!')
  }

  const calculateGrade = () => {
    if (items.length === 0) return null

    let totalWeightedScore = 0
    let totalWeight = 0

    items.forEach(item => {
      const percentage = (item.score / item.maxScore) * 100
      totalWeightedScore += percentage * item.weight
      totalWeight += item.weight
    })

    if (totalWeight === 0) return null

    const finalGrade = totalWeightedScore / totalWeight
    return {
      percentage: finalGrade,
      letter: getLetterGrade(finalGrade),
      points: getGPA(finalGrade),
    }
  }

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 97) return 'A+'
    if (percentage >= 93) return 'A'
    if (percentage >= 90) return 'A-'
    if (percentage >= 87) return 'B+'
    if (percentage >= 83) return 'B'
    if (percentage >= 80) return 'B-'
    if (percentage >= 77) return 'C+'
    if (percentage >= 73) return 'C'
    if (percentage >= 70) return 'C-'
    if (percentage >= 67) return 'D+'
    if (percentage >= 65) return 'D'
    if (percentage >= 60) return 'D-'
    return 'F'
  }

  const getGPA = (percentage: number): number => {
    if (percentage >= 97) return 4.0
    if (percentage >= 93) return 4.0
    if (percentage >= 90) return 3.7
    if (percentage >= 87) return 3.3
    if (percentage >= 83) return 3.0
    if (percentage >= 80) return 2.7
    if (percentage >= 77) return 2.3
    if (percentage >= 73) return 2.0
    if (percentage >= 70) return 1.7
    if (percentage >= 67) return 1.3
    if (percentage >= 65) return 1.0
    if (percentage >= 60) return 0.7
    return 0.0
  }

  const grade = calculateGrade()
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Grade Item</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment/Exam Name
              </label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., Midterm Exam"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score
                </label>
                <input
                  type="number"
                  value={newItem.score}
                  onChange={(e) => setNewItem({ ...newItem, score: e.target.value })}
                  placeholder="85"
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Score
                </label>
                <input
                  type="number"
                  value={newItem.maxScore}
                  onChange={(e) => setNewItem({ ...newItem, maxScore: e.target.value })}
                  placeholder="100"
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (%)
                </label>
                <input
                  type="number"
                  value={newItem.weight}
                  onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                  placeholder="25"
                  min="0"
                  step="0.1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <button
              onClick={addItem}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Grade Item
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {grade && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalculatorIcon className="h-5 w-5" />
                Final Grade
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {grade.percentage.toFixed(2)}%
                  </div>
                  <div className="text-2xl font-semibold text-gray-700">
                    {grade.letter}
                  </div>
                  <div className="text-lg text-gray-600 mt-2">
                    GPA: {grade.points.toFixed(2)}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Weight:</span>
                    <span className="font-medium">{totalWeight.toFixed(1)}%</span>
                  </div>
                  {totalWeight !== 100 && (
                    <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                      ⚠️ Total weight is {totalWeight.toFixed(1)}%. It should equal 100% for accurate calculation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" />
                Grade Items ({items.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const percentage = (item.score / item.maxScore) * 100
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.score} / {item.maxScore} ({percentage.toFixed(1)}%) • Weight: {item.weight}%
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-red-600 hover:text-red-700"
                        title="Remove"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
          No grade items yet. Add your first grade item above.
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

