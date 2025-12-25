'use client'

import { useState } from 'react'
import { PlusIcon, TrashIcon, CalculatorIcon, AwardIcon } from 'lucide-react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Course {
  id: string
  name: string
  credits: number
  grade: string
}

const gradePoints: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
}

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([])
  const [newCourse, setNewCourse] = useState({ name: '', credits: '', grade: 'A' })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const addCourse = () => {
    if (!newCourse.name || !newCourse.credits) {
      showMessage('Please fill in all fields', 'error')
      return
    }

    const credits = parseFloat(newCourse.credits)
    if (isNaN(credits) || credits <= 0) {
      showMessage('Please enter a valid number of credits', 'error')
      return
    }

    const course: Course = {
      id: Date.now().toString(),
      name: newCourse.name,
      credits,
      grade: newCourse.grade,
    }

    setCourses([...courses, course])
    setNewCourse({ name: '', credits: '', grade: 'A' })
    showMessage('Course added!')
  }

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id))
    showMessage('Course removed!')
  }

  const calculateGPA = () => {
    if (courses.length === 0) return null

    let totalPoints = 0
    let totalCredits = 0

    courses.forEach(course => {
      const points = gradePoints[course.grade] || 0
      totalPoints += points * course.credits
      totalCredits += course.credits
    })

    if (totalCredits === 0) return null

    return {
      gpa: totalPoints / totalCredits,
      totalCredits,
      totalPoints,
    }
  }

  const gpa = calculateGPA()
  const gradeOptions = Object.keys(gradePoints)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Course</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                placeholder="e.g., Mathematics 101"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credits
                </label>
                <input
                  type="number"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                  placeholder="3"
                  min="0"
                  step="0.5"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  value={newCourse.grade}
                  onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {gradeOptions.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={addCourse}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Course
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {gpa && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AwardIcon className="h-5 w-5" />
                GPA Results
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {gpa.gpa.toFixed(3)}
                  </div>
                  <div className="text-lg text-gray-600">
                    Grade Point Average
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Credits:</span>
                    <span className="font-medium">{gpa.totalCredits}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Grade Points:</span>
                    <span className="font-medium">{gpa.totalPoints.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Number of Courses:</span>
                    <span className="font-medium">{courses.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {courses.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalculatorIcon className="h-5 w-5" />
                Courses ({courses.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {courses.map((course) => {
                  const points = gradePoints[course.grade] || 0
                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{course.name}</div>
                        <div className="text-sm text-gray-600">
                          {course.credits} credits • Grade: {course.grade} ({points.toFixed(1)} points)
                        </div>
                      </div>
                      <button
                        onClick={() => removeCourse(course.id)}
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

      {courses.length === 0 && (
        <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
          No courses yet. Add your first course above.
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

