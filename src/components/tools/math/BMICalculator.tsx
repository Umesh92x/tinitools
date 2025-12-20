'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

type UnitSystem = 'metric' | 'imperial'

interface BMICategory {
  range: string
  category: string
  description: string
  color: string
}

const bmiCategories: BMICategory[] = [
  {
    range: 'Less than 18.5',
    category: 'Underweight',
    description: 'May indicate malnutrition or other health problems',
    color: 'text-blue-600',
  },
  {
    range: '18.5 to 24.9',
    category: 'Normal weight',
    description: 'Generally good overall health',
    color: 'text-green-600',
  },
  {
    range: '25.0 to 29.9',
    category: 'Overweight',
    description: 'May lead to health problems',
    color: 'text-yellow-600',
  },
  {
    range: '30.0 or greater',
    category: 'Obese',
    description: 'Higher risk for serious health problems',
    color: 'text-red-600',
  },
]

export function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [bmi, setBMI] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const calculateBMI = () => {
    try {
      let bmiValue: number

      if (unitSystem === 'metric') {
        if (!height || !weight) {
          throw new Error('Please enter both height and weight')
        }

        const heightM = parseFloat(height) / 100 // convert cm to m
        const weightKg = parseFloat(weight)

        if (isNaN(heightM) || isNaN(weightKg)) {
          throw new Error('Please enter valid numbers')
        }

        if (heightM <= 0 || weightKg <= 0) {
          throw new Error('Height and weight must be greater than 0')
        }

        bmiValue = weightKg / (heightM * heightM)
      } else {
        if (!heightFt || !heightIn || !weight) {
          throw new Error('Please enter height and weight')
        }

        const heightInches = (parseFloat(heightFt) * 12) + parseFloat(heightIn)
        const weightLbs = parseFloat(weight)

        if (isNaN(heightInches) || isNaN(weightLbs)) {
          throw new Error('Please enter valid numbers')
        }

        if (heightInches <= 0 || weightLbs <= 0) {
          throw new Error('Height and weight must be greater than 0')
        }

        bmiValue = (weightLbs * 703) / (heightInches * heightInches)
      }

      setBMI(bmiValue)
      setToastMessage('BMI calculated successfully')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setBMI(null)
      setToastMessage(error instanceof Error ? error.message : 'Invalid input')
      setToastType('error')
      setShowToast(true)
    }
  }

  const getBMICategory = (bmi: number): BMICategory => {
    if (bmi < 18.5) return bmiCategories[0]
    if (bmi < 25) return bmiCategories[1]
    if (bmi < 30) return bmiCategories[2]
    return bmiCategories[3]
  }

  const resetCalculator = () => {
    setHeight('')
    setWeight('')
    setHeightFt('')
    setHeightIn('')
    setBMI(null)
  }

  const handleUnitChange = (system: UnitSystem) => {
    setUnitSystem(system)
    resetCalculator()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        {/* Unit System Selection */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleUnitChange('metric')}
            className={`px-4 py-2 rounded ${
              unitSystem === 'metric'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Metric (cm/kg)
          </button>
          <button
            onClick={() => handleUnitChange('imperial')}
            className={`px-4 py-2 rounded ${
              unitSystem === 'imperial'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Imperial (ft/lbs)
          </button>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {unitSystem === 'metric' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height in centimeters"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (ft)
                  </label>
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    placeholder="Feet"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (in)
                  </label>
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    placeholder="Inches"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={`Enter weight in ${unitSystem === 'metric' ? 'kilograms' : 'pounds'}`}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={calculateBMI}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Calculate BMI
          </button>
          <button
            onClick={resetCalculator}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        {bmi !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Your BMI</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {bmi.toFixed(1)}
              </p>
              <p className={`text-lg font-medium mt-2 ${getBMICategory(bmi).color}`}>
                {getBMICategory(bmi).category}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {getBMICategory(bmi).description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* BMI Categories */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">BMI Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bmiCategories.map((category) => (
            <div
              key={category.category}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <p className={`font-medium ${category.color}`}>{category.category}</p>
              <p className="text-sm text-gray-600">BMI range: {category.range}</p>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            </div>
          ))}
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