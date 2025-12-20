'use client'

import { useState } from 'react'

type ActivityLevel = 'sedentary' | 'moderate' | 'active'
type Climate = 'temperate' | 'hot' | 'humid'

const activityLevels = {
  sedentary: { label: 'Sedentary (little or no exercise)', multiplier: 1.0 },
  moderate: { label: 'Moderate (exercise 3-5 days/week)', multiplier: 1.2 },
  active: { label: 'Active (exercise 6-7 days/week)', multiplier: 1.4 },
}

const climateFactors = {
  temperate: { label: 'Temperate Climate', multiplier: 1.0 },
  hot: { label: 'Hot Climate', multiplier: 1.2 },
  humid: { label: 'Hot & Humid Climate', multiplier: 1.3 },
}

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary')
  const [climate, setClimate] = useState<Climate>('temperate')
  const [result, setResult] = useState<{ ml: number; cups: number } | null>(null)

  const calculateWaterIntake = () => {
    const w = parseFloat(weight)
    if (isNaN(w)) return

    // Base calculation: 30ml per kg of body weight
    const baseIntake = w * 30
    
    // Apply activity and climate multipliers
    const activityMultiplier = activityLevels[activityLevel].multiplier
    const climateMultiplier = climateFactors[climate].multiplier
    
    const totalIntakeML = Math.round(baseIntake * activityMultiplier * climateMultiplier)
    const totalIntakeCups = Math.round((totalIntakeML / 240) * 10) / 10 // 240ml per cup, round to 1 decimal

    setResult({ ml: totalIntakeML, cups: totalIntakeCups })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Water Intake Calculator</h1>
        <p className="text-gray-600 mb-8">
          Calculate your daily water intake needs based on your weight, activity level, and climate.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Weight Input */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.1"
              />
            </div>

            {/* Activity Level Selection */}
            <div>
              <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                id="activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.entries(activityLevels).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Climate Selection */}
            <div>
              <label htmlFor="climate" className="block text-sm font-medium text-gray-700 mb-2">
                Climate
              </label>
              <select
                id="climate"
                value={climate}
                onChange={(e) => setClimate(e.target.value as Climate)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.entries(climateFactors).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateWaterIntake}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate Water Intake
            </button>

            {/* Results */}
            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Your Daily Water Intake Needs:</h2>
                <p className="text-3xl font-bold text-blue-600">{result.ml} ml</p>
                <p className="text-xl text-blue-600">({result.cups} cups)</p>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>💡 Tips for staying hydrated:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Keep a water bottle with you throughout the day</li>
                    <li>Drink a glass of water with each meal</li>
                    <li>Set reminders on your phone</li>
                    <li>Drink more during and after exercise</li>
                    <li>Monitor your urine color - it should be light yellow</li>
                  </ul>
                  <p className="mt-4 italic">
                    Note: This is a general guideline. Adjust based on your specific needs and consult with a healthcare provider if needed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 