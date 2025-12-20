'use client'

import { useState } from 'react'

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

  const calculateHeartRateZones = () => {
    if (!age || !restingHeartRate) return

    const maxHeartRate = 220 - parseInt(age)
    const hrr = maxHeartRate - parseInt(restingHeartRate) // Heart Rate Reserve
    const rhr = parseInt(restingHeartRate)

    const calculateZoneHR = (percentage: number) => {
      return Math.round(hrr * percentage + rhr)
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

    setZones(newZones)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Heart Rate Zone Calculator</h1>
        <p className="text-gray-600 mb-8">
          Calculate your heart rate training zones based on your age and resting heart rate. These zones help you optimize your workouts for different fitness goals.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6">
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
                min="0"
                max="120"
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
              />
              <p className="mt-1 text-sm text-gray-500">
                Measure your heart rate when you first wake up, while still lying in bed
              </p>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateHeartRateZones}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate Heart Rate Zones
            </button>

            {/* Results */}
            {zones.length > 0 && (
              <div className="mt-6 space-y-6">
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

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">How to Use Heart Rate Zones</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Zone 1: Use for warm-up and recovery</li>
                    <li>• Zone 2: Ideal for long, slow distance training</li>
                    <li>• Zone 3: Good for improving aerobic capacity</li>
                    <li>• Zone 4: Increases maximum performance capacity</li>
                    <li>• Zone 5: Use sparingly for maximum effort intervals</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 