'use client'

import { FormEvent, useState } from 'react'
import { format, addMinutes, subMinutes } from 'date-fns'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

type CalculationType = 'bedtime' | 'wakeup'

export default function SleepCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('bedtime')
  const [time, setTime] = useState('')
  const [results, setResults] = useState<Date[]>([])
  const [showTooltip, setShowTooltip] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sleep cycle is approximately 90 minutes
  const SLEEP_CYCLE_MINUTES = 90
  // Time to fall asleep (average)
  const FALL_ASLEEP_MINUTES = 15
  // Recommended sleep cycles (5-6 cycles = 7.5-9 hours)
  const RECOMMENDED_CYCLES = [5, 6]

  const calculateSleepTimes = (e?: FormEvent) => {
    if (e) e.preventDefault()

    if (!time) {
      setError('Please choose a time first.')
      setResults([])
      return
    }

    setError(null)

    const [hours, minutes] = time.split(':').map(Number)
    const baseTime = new Date()
    baseTime.setHours(hours, minutes, 0, 0)

    if (calculationType === 'bedtime') {
      // Calculate when to go to bed
      const times = RECOMMENDED_CYCLES.map((cycles) =>
        subMinutes(baseTime, SLEEP_CYCLE_MINUTES * cycles + FALL_ASLEEP_MINUTES),
      )
      setResults(times)
    } else {
      // Calculate when to wake up
      const times = RECOMMENDED_CYCLES.map((cycles) =>
        addMinutes(baseTime, SLEEP_CYCLE_MINUTES * cycles + FALL_ASLEEP_MINUTES),
      )
      setResults(times)
    }
  }

  const handleReset = () => {
    setTime('')
    setResults([])
    setError(null)
  }

  const relatedTools = [
    { name: 'Calorie Calculator', href: '/health-fitness/calorie-calculator' },
    { name: 'Water Intake Calculator', href: '/health-fitness/water-intake' },
    { name: 'Heart Rate Zone Calculator', href: '/health-fitness/heart-rate' },
    { name: 'Exercise Rep Counter', href: '/health-fitness/rep-counter' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Sleep Time Calculator"
        description="Free sleep time calculator - Calculate optimal bedtime and wake-up times based on sleep cycles. Get personalized recommendations for better sleep. No signup required."
        category="Health & Fitness"
        url="/health-fitness/sleep-calculator"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Health & Fitness', href: '/health-fitness' },
            { label: 'Sleep Time Calculator' },
          ]} />
          <h1 className="text-3xl font-bold mb-6">Sleep Time Calculator</h1>
        <p className="text-gray-600 mb-3">
          Calculate the best time to wake up or go to bed based on sleep cycles.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          A typical sleep cycle lasts about 90 minutes. Many adults feel rested with about 5–6 full cycles
          (roughly 7.5–9 hours of sleep), but needs can vary from person to person.
        </p>

        <form
          onSubmit={calculateSleepTimes}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {/* Calculation Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to calculate:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCalculationType('bedtime')}
                  className={`py-2 px-4 rounded-md text-center ${
                    calculationType === 'bedtime'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Bedtime
                </button>
                <button
                  onClick={() => setCalculationType('wakeup')}
                  className={`py-2 px-4 rounded-md text-center ${
                    calculationType === 'wakeup'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Wake-up Time
                </button>
              </div>
            </div>

            {/* Time Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {calculationType === 'bedtime'
                  ? 'I want to wake up at:'
                  : 'I want to go to bed at:'}
              </label>
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="HH:MM"
                  required
                />
                {showTooltip && (
                  <div className="absolute left-0 -bottom-12 bg-gray-800 text-white text-sm px-3 py-1 rounded shadow-lg whitespace-nowrap z-10">
                    Enter time in 24-hour format (e.g., 07:00 for 7 AM, 22:00 for 10 PM)
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                You&apos;ll get a few suggested times that line up with complete sleep cycles.
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
                Calculate
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
            {results.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h2 className="text-lg font-semibold mb-4">
                  {calculationType === 'bedtime'
                    ? 'Recommended bedtimes:'
                    : 'Recommended wake-up times:'}
                </h2>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {format(result, 'h:mm a')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {RECOMMENDED_CYCLES[index] * 1.5} hours of sleep
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {RECOMMENDED_CYCLES[index]} sleep cycles
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  We assume it takes about {FALL_ASLEEP_MINUTES} minutes to fall asleep. These times have been
                  adjusted so that you complete full sleep cycles before your target time.
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  This tool is for general guidance only and does not replace advice from a healthcare professional
                  or sleep specialist.
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Sleep Tips */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Tips for Better Sleep</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Stick to a consistent sleep schedule, even on weekends</li>
            <li>• Create a relaxing bedtime routine</li>
            <li>• Keep your bedroom cool, dark, and quiet</li>
            <li>• Avoid screens 1-2 hours before bedtime</li>
            <li>• Limit caffeine and heavy meals close to bedtime</li>
            <li>• Exercise regularly, but not too close to bedtime</li>
          </ul>
        </div>
        <RelatedTools tools={relatedTools} currentTool="/health-fitness/sleep-calculator" />
      </div>
    </div>
    </>
  )
} 