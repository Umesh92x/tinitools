'use client'

import { useState } from 'react'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Participant {
  id: string
  name: string
  timeZone: string
}

const commonTimeZones = [
  { name: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { name: 'America/New_York', label: 'New York (EST/EDT)' },
  { name: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { name: 'Europe/London', label: 'London (GMT/BST)' },
  { name: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { name: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { name: 'Asia/Dubai', label: 'Dubai (GST)' },
  { name: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { name: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
]

export function MeetingPlanner() {
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '', timeZone: 'UTC' },
  ])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState('60')

  const addParticipant = () => {
    const newId = (participants.length + 1).toString()
    setParticipants([...participants, { id: newId, name: '', timeZone: 'UTC' }])
  }

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter(p => p.id !== id))
    }
  }

  const updateParticipant = (id: string, field: keyof Participant, value: string) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const generateTimeSlots = () => {
    const slots = []
    const baseDate = new Date(date)
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = new Date(baseDate)
        time.setHours(hour, minute)
        
        const timeSlot = {
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          participants: participants.map(p => ({
            name: p.name || `Participant ${p.id}`,
            localTime: new Date(time).toLocaleTimeString('en-US', {
              timeZone: p.timeZone,
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          }))
        }
        slots.push(timeSlot)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Meeting Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Participants</h3>
            <button
              type="button"
              onClick={addParticipant}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          
          <div className="space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={participant.name}
                  onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <select
                  value={participant.timeZone}
                  onChange={(e) => updateParticipant(participant.id, 'timeZone', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {commonTimeZones.map((tz) => (
                    <option key={tz.name} value={tz.name}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                {participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    className="inline-flex items-center p-1.5 border border-transparent rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                UTC Time
              </th>
              {participants.map((p) => (
                <th key={p.id} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {p.name || `Participant ${p.id}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {timeSlots.map((slot, index) => (
              <tr key={index} className={index % 2 === 0 ? undefined : 'bg-gray-50'}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {slot.time}
                </td>
                {slot.participants.map((p, i) => (
                  <td key={i} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {p.localTime}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 