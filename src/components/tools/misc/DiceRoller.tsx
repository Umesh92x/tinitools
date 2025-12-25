'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

interface DiceResult {
  diceType: string
  result: number
  timestamp: Date
}

const diceTypes = [
  { value: 'd4', label: 'D4', sides: 4 },
  { value: 'd6', label: 'D6', sides: 6 },
  { value: 'd8', label: 'D8', sides: 8 },
  { value: 'd10', label: 'D10', sides: 10 },
  { value: 'd12', label: 'D12', sides: 12 },
  { value: 'd20', label: 'D20', sides: 20 },
  { value: 'd100', label: 'D100', sides: 100 },
]

export function DiceRoller() {
  const [selectedDice, setSelectedDice] = useState('d6')
  const [quantity, setQuantity] = useState('1')
  const [results, setResults] = useState<DiceResult[]>([])
  const [isRolling, setIsRolling] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const rollDice = () => {
    const qty = parseInt(quantity) || 1
    if (qty < 1 || qty > 20) {
      setToastMessage('Quantity must be between 1 and 20')
      setShowToast(true)
      return
    }

    setIsRolling(true)
    const dice = diceTypes.find(d => d.value === selectedDice)!
    
    setTimeout(() => {
      const newResults: DiceResult[] = []
      for (let i = 0; i < qty; i++) {
        const result = Math.floor(Math.random() * dice.sides) + 1
        newResults.push({
          diceType: dice.label,
          result,
          timestamp: new Date(),
        })
      }
      
      setResults(prev => [...newResults, ...prev].slice(0, 50))
      setIsRolling(false)
      
      const total = newResults.reduce((sum, r) => sum + r.result, 0)
      setToastMessage(qty === 1 
        ? `Rolled ${dice.label}: ${total}`
        : `Rolled ${qty}x ${dice.label}: Total = ${total}`
      )
      setShowToast(true)
    }, 500)
  }

  const clearHistory = () => {
    setResults([])
    setToastMessage('History cleared!')
    setShowToast(true)
  }

  const getStats = () => {
    if (results.length === 0) return null
    
    const recentResults = results.slice(0, 20)
    const values = recentResults.map(r => r.result)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    return { sum, avg, min, max, count: recentResults.length }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dice Type
              </label>
              <select
                value={selectedDice}
                onChange={(e) => setSelectedDice(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {diceTypes.map((dice) => (
                  <option key={dice.value} value={dice.value}>
                    {dice.label} (1-{dice.sides})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max="20"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Roll 1-20 dice at once
              </p>
            </div>

            <button
              onClick={rollDice}
              disabled={isRolling}
              className={`w-full px-4 py-3 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isRolling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
            >
              {isRolling ? 'Rolling...' : `Roll ${quantity}x ${diceTypes.find(d => d.value === selectedDice)?.label}`}
            </button>
          </div>

          {stats && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics (Last {stats.count} rolls)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.sum}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Average</div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.avg.toFixed(1)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Min</div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.min}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Max</div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.max}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Roll History</h3>
              {results.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="bg-white p-4 rounded-md min-h-[200px] max-h-[400px] overflow-y-auto">
              {results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">#{results.length - index}</span>
                        <span className="text-sm font-medium text-gray-700">{result.diceType}</span>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">{result.result}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Roll dice to see results here
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Select Dice</h4>
                <p className="text-sm text-gray-600">
                  Choose from D4, D6, D8, D10, D12, D20, or D100 dice.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. Set Quantity</h4>
                <p className="text-sm text-gray-600">
                  Choose how many dice to roll at once (1-20).
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Roll</h4>
                <p className="text-sm text-gray-600">
                  Click "Roll" to generate random dice results. View statistics and history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}

