'use client'

import { FormEvent, useState } from 'react'

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
  const [result, setResult] = useState<{ ml: number; cups: number; liters: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculateWaterIntake = (e?: FormEvent) => {
    if (e) e.preventDefault()

    const w = parseFloat(weight)
    if (!w || w <= 0 || w > 300) {
      setError('Please enter a valid weight in kilograms (between 20 and 300).')
      setResult(null)
      return
    }

    setError(null)

    // Base calculation: 30ml per kg of body weight
    const baseIntake = w * 30
    
    // Apply activity and climate multipliers
    const activityMultiplier = activityLevels[activityLevel].multiplier
    const climateMultiplier = climateFactors[climate].multiplier
    
    const totalIntakeML = Math.round(baseIntake * activityMultiplier * climateMultiplier)
    const totalIntakeCups = Math.round((totalIntakeML / 240) * 10) / 10 // 240ml per cup, round to 1 decimal
    const totalIntakeLiters = Math.round((totalIntakeML / 1000) * 10) / 10 // liters, 1 decimal

    setResult({ ml: totalIntakeML, cups: totalIntakeCups, liters: totalIntakeLiters })
  }

  const handleReset = () => {
    setWeight('')
    setActivityLevel('sedentary')
    setClimate('temperate')
    setResult(null)
    setError(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Water Intake Calculator</h1>
        <p className="text-gray-600 mb-4">
          Calculate your daily water intake needs based on your weight, activity level, and climate.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          This calculator uses a common guideline of around 30 ml of water per kilogram of body weight and adjusts
          it based on your activity level and climate. Individual needs may vary.
        </p>

        <form
          onSubmit={calculateWaterIntake}
          className="bg-white rounded-lg shadow-sm p-6"
        >
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
                min="20"
                max="300"
                step="0.1"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter your body weight in kilograms. If you know your weight in pounds, divide it by 2.2 to convert.
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                Choose the option that best matches how active you are on a typical day.
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                Hot and humid environments usually require more water intake.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Calculate Water Intake
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Results */}
            {result !== null && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md space-y-3">
                <h2 className="text-lg font-semibold">Your Daily Water Intake Needs</h2>
                <p className="text-3xl font-bold text-blue-600">
                  {result.ml} ml / day
                </p>
                <p className="text-lg text-blue-600">
                  ≈ {result.liters} liters ({result.cups} cups)
                </p>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <p className="font-medium">How to use this:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Spread your water intake evenly throughout the day.</li>
                    <li>Drink more before, during, and after exercise.</li>
                    <li>Increase intake if you sweat a lot or feel thirsty.</li>
                    <li>Monitor your urine color – light yellow usually indicates good hydration.</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-500">
                    This is a general guideline based on your inputs. People with certain health conditions
                    (e.g., kidney or heart issues) should follow advice from their healthcare provider.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 