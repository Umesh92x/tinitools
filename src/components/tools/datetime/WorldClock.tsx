'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TimeZone {
  name: string
  city: string
  offset: string
  time?: string
}

const popularTimeZones: TimeZone[] = [
  { name: 'UTC', city: 'Coordinated Universal Time', offset: '+00:00' },
  { name: 'America/New_York', city: 'New York', offset: '-05:00' },
  { name: 'America/Los_Angeles', city: 'Los Angeles', offset: '-08:00' },
  { name: 'Europe/London', city: 'London', offset: '+00:00' },
  { name: 'Europe/Paris', city: 'Paris', offset: '+01:00' },
  { name: 'Asia/Tokyo', city: 'Tokyo', offset: '+09:00' },
  { name: 'Asia/Dubai', city: 'Dubai', offset: '+04:00' },
  { name: 'Asia/Singapore', city: 'Singapore', offset: '+08:00' },
  { name: 'Asia/Kolkata', city: 'India (New Delhi)', offset: '+05:30' },
  { name: 'Australia/Sydney', city: 'Sydney', offset: '+11:00' },
  { name: 'Pacific/Auckland', city: 'Auckland', offset: '+13:00' },
]

export function WorldClock() {
  const [timeZones, setTimeZones] = useState<TimeZone[]>(popularTimeZones)
  const [search, setSearch] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [use24Hour, setUse24Hour] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const updateTimes = () => {
    return timeZones.map((tz) => ({
      ...tz,
      time: new Date(
        currentTime.toLocaleString('en-US', { timeZone: tz.name }),
      ).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !use24Hour,
      }),
    }))
  }

  const localTimeString = currentTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour,
  })

  const localDateString = currentTime.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const filteredTimeZones = updateTimes().filter(tz =>
    tz.city.toLowerCase().includes(search.toLowerCase()) ||
    tz.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between md:max-w-md w-full">
          <div>
            <p className="text-xs text-gray-500">Your local time</p>
            <p className="text-lg font-semibold text-gray-900">{localTimeString}</p>
            <p className="text-xs text-gray-500">{localDateString}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">12h</span>
            <button
              type="button"
              onClick={() => setUse24Hour((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                use24Hour ? 'bg-indigo-600 border-indigo-600' : 'bg-gray-200 border-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  use24Hour ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-500">24h</span>
          </div>
        </div>

        <div className="relative md:max-w-md w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Search cities or time zones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTimeZones.map((tz) => (
          <div
            key={tz.name}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="text-lg font-semibold text-gray-900">{tz.city}</div>
            <div className="text-2xl font-bold text-indigo-600 mt-2">
              {tz.time}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {tz.name} (UTC{tz.offset})
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 