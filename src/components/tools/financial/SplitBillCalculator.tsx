'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface Person {
  id: string
  name: string
  amount: string
}

interface SplitResult {
  totalAmount: number
  perPersonAmount: number
  people: {
    name: string
    paid: number
    owes: number
    gets: number
  }[]
}

export function SplitBillCalculator() {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: '', amount: '' },
    { id: '2', name: '', amount: '' },
  ])
  const [result, setResult] = useState<SplitResult | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const addPerson = () => {
    setPeople([
      ...people,
      { id: Math.random().toString(), name: '', amount: '' },
    ])
  }

  const removePerson = (id: string) => {
    if (people.length <= 2) {
      setToastMessage('Minimum 2 people required')
      setToastType('error')
      setShowToast(true)
      return
    }
    setPeople(people.filter((person) => person.id !== id))
  }

  const updatePerson = (id: string, field: 'name' | 'amount', value: string) => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, [field]: value } : person
      )
    )
  }

  const validateInputs = () => {
    if (people.some((person) => !person.name.trim())) {
      setToastMessage('Please enter a name for each person.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    if (people.some((person) => !person.amount.trim())) {
      setToastMessage('Please enter the amount paid for each person (use 0 if they did not pay).')
      setToastType('error')
      setShowToast(true)
      return false
    }

    const amounts = people.map((person) => parseFloat(person.amount))
    if (amounts.some((amount) => isNaN(amount) || amount < 0)) {
      setToastMessage('Please enter valid non-negative amounts.')
      setToastType('error')
      setShowToast(true)
      return false
    }

    return true
  }

  const calculateSplit = () => {
    if (!validateInputs()) return

    const totalAmount = people.reduce(
      (sum, person) => sum + parseFloat(person.amount),
      0
    )
    const perPersonAmount = totalAmount / people.length

    const splitResult: SplitResult = {
      totalAmount,
      perPersonAmount,
      people: people.map((person) => {
        const paid = parseFloat(person.amount)
        const diff = paid - perPersonAmount
        return {
          name: person.name,
          paid,
          owes: diff < 0 ? Math.abs(diff) : 0,
          gets: diff > 0 ? diff : 0,
        }
      }),
    }

    setResult(splitResult)
    setToastMessage('Bill split calculation completed!')
    setToastType('success')
    setShowToast(true)
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })
  }

  const handleReset = () => {
    setPeople([
      { id: '1', name: '', amount: '' },
      { id: '2', name: '', amount: '' },
    ])
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {people.map((person, index) => (
            <div key={person.id} className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Person {index + 1} Name
                </label>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter name"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Amount Paid
                </label>
                <input
                  type="number"
                  value={person.amount}
                  onChange={(e) =>
                    updatePerson(person.id, 'amount', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter amount"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => removePerson(person.id)}
                  className="mb-1 p-2 text-red-600 hover:text-red-800"
                  title="Remove person"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <button
              onClick={addPerson}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Person
            </button>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={calculateSplit}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate Split
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Split Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Bill Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(result.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Per Person</p>
                <p className="text-lg font-semibold text-indigo-600">
                  {formatCurrency(result.perPersonAmount)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Settlement Details
              </h4>
              <div className="space-y-3">
                {result.people.map((person) => (
                  <div
                    key={person.name}
                    className="bg-white p-3 rounded-md shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {person.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Paid: {formatCurrency(person.paid)}
                        </p>
                      </div>
                      {person.owes > 0 && (
                        <p className="text-red-600 font-medium">
                          Owes: {formatCurrency(person.owes)}
                        </p>
                      )}
                      {person.gets > 0 && (
                        <p className="text-green-600 font-medium">
                          Gets: {formatCurrency(person.gets)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 