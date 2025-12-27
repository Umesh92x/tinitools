'use client'

import { FormEvent, useState } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

interface HeartRateZone {
  name: string;
  description: string;
  min: number;
  max: number;
  intensity: string;
  benefits: string;
}

export default function HeartRateCalculator() {
  const [age, setAge] = useState('')
  const [restingHeartRate, setRestingHeartRate] = useState('')
  const [zones, setZones] = useState<HeartRateZone[]>([])
  const [maxHR, setMaxHR] = useState<number | null>(null)
  const [heartRateReserve, setHeartRateReserve] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculateHeartRateZones = (e?: FormEvent) => {
    if (e) e.preventDefault()

    if (!age || !restingHeartRate) {
      setError('Please enter both your age and resting heart rate.')
      setZones([])
      setMaxHR(null)
      setHeartRateReserve(null)
      return
    }

    const ageNum = parseInt(age, 10)
    const rhrNum = parseInt(restingHeartRate, 10)

    if (
      Number.isNaN(ageNum) ||
      Number.isNaN(rhrNum) ||
      ageNum < 13 ||
      ageNum > 100 ||
      rhrNum < 30 ||
      rhrNum > 120
    ) {
      setError('Please enter a realistic age (13–100 years) and resting heart rate (30–120 bpm).')
      setZones([])
      setMaxHR(null)
      setHeartRateReserve(null)
      return
    }

    const maxHeartRate = 220 - ageNum
    const hrr = maxHeartRate - rhrNum // Heart Rate Reserve

    const calculateZoneHR = (percentage: number) => {
      return Math.round(hrr * percentage + rhrNum)
    }

    const newZones: HeartRateZone[] = [
      {
        name: 'Zone 1 - Very Light',
        description: '50-60% of Max HR',
        min: calculateZoneHR(0.5),
        max: calculateZoneHR(0.6),
        intensity: 'Very Light',
        benefits: 'Warm up, recovery, and improving basic endurance',
      },
      {
        name: 'Zone 2 - Light',
        description: '60-70% of Max HR',
        min: calculateZoneHR(0.6),
        max: calculateZoneHR(0.7),
        intensity: 'Light',
        benefits: 'Basic endurance and fat burning',
      },
      {
        name: 'Zone 3 - Moderate',
        description: '70-80% of Max HR',
        min: calculateZoneHR(0.7),
        max: calculateZoneHR(0.8),
        intensity: 'Moderate',
        benefits: 'Improved aerobic fitness and endurance',
      },
      {
        name: 'Zone 4 - Hard',
        description: '80-90% of Max HR',
        min: calculateZoneHR(0.8),
        max: calculateZoneHR(0.9),
        intensity: 'Hard',
        benefits: 'Improved anaerobic fitness and speed',
      },
      {
        name: 'Zone 5 - Maximum',
        description: '90-100% of Max HR',
        min: calculateZoneHR(0.9),
        max: maxHeartRate,
        intensity: 'Maximum',
        benefits: 'Improved power and performance',
      },
    ]

    setError(null)
    setMaxHR(maxHeartRate)
    setHeartRateReserve(hrr)
    setZones(newZones)
  }

  const relatedTools = [
    { name: 'Calorie Calculator', href: '/health-fitness/calorie-calculator' },
    { name: 'Exercise Rep Counter', href: '/health-fitness/rep-counter' },
    { name: 'Water Intake Calculator', href: '/health-fitness/water-intake' },
    { name: 'Sleep Time Calculator', href: '/health-fitness/sleep-calculator' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Heart Rate Zone Calculator"
        description="Free heart rate zone calculator - Calculate your training zones based on age and resting heart rate. Perfect for optimizing workouts. No signup required."
        category="Health & Fitness"
        url="/health-fitness/heart-rate"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Health & Fitness', href: '/health-fitness' },
            { label: 'Heart Rate Zone Calculator' },
          ]} />
          <h1 className="text-3xl font-bold mb-6">Heart Rate Zone Calculator</h1>
        <p className="text-gray-600 mb-3">
          Calculate your heart rate training zones based on your age and resting heart rate.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          This calculator uses the Karvonen formula (Heart Rate Reserve method) to estimate zones. Use a heart
          rate monitor for best accuracy, and always listen to your body during workouts.
        </p>

        <form
          onSubmit={calculateHeartRateZones}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {/* Age Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (years)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="13"
                max="100"
                required
              />
            </div>

            {/* Resting Heart Rate Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resting Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="30"
                max="120"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Measure your heart rate when you first wake up, while still lying in bed
              </p>
            </div>

            {/* Calculate Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate Heart Rate Zones
            </button>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Results */}
            {zones.length > 0 && (
              <div className="mt-6 space-y-6">
                {maxHR !== null && (
                  <div className="p-4 bg-blue-50 rounded-md">
                    <h3 className="text-lg font-semibold mb-1">Summary</h3>
                    <p className="text-sm text-gray-700">
                      Estimated maximum heart rate: <span className="font-semibold">{maxHR} bpm</span>
                    </p>
                    {heartRateReserve !== null && (
                      <p className="text-sm text-gray-700">
                        Heart rate reserve (HRR): <span className="font-semibold">{heartRateReserve} bpm</span>
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      These values are estimates based on population formulas. Your true max heart rate can vary.
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                {zones.map((zone, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${0.1 + index * 0.15})`,
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{zone.name}</h3>
                      <span className="text-sm text-gray-600">{zone.description}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {zone.min} - {zone.max} bpm
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Intensity:</strong> {zone.intensity}</p>
                      <p><strong>Benefits:</strong> {zone.benefits}</p>
                    </div>
                  </div>
                ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">How to Use Heart Rate Zones</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Zone 1: Use for warm-up and recovery</li>
                    <li>• Zone 2: Ideal for long, steady efforts and base training</li>
                    <li>• Zone 3: Good for improving aerobic capacity and tempo efforts</li>
                    <li>• Zone 4: Increases maximum performance capacity and speed</li>
                    <li>• Zone 5: Use sparingly for short, maximum-effort intervals</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-500">
                    Always check with a healthcare professional before starting a new or high-intensity training
                    program, especially if you have any heart or health concerns.
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>
        <RelatedTools tools={relatedTools} currentTool="/health-fitness/heart-rate" />
      </div>
    </div>
    </>
  )
} 