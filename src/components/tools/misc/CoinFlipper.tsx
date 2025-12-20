'use client'

import { useState } from 'react'
import { AdUnit } from '@/components/ads/AdUnit'
import { Toast } from '@/components/ui/Toast'

export function CoinFlipper() {
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<'heads' | 'tails' | null>(null)
  const [flipCount, setFlipCount] = useState(0)
  const [stats, setStats] = useState({ heads: 0, tails: 0 })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const flipCoin = () => {
    if (isFlipping) return

    setIsFlipping(true)
    setResult(null)

    // Random flip duration between 2-3 seconds
    const flipDuration = 2000 + Math.random() * 1000

    setTimeout(() => {
      const newResult = Math.random() < 0.5 ? 'heads' : 'tails'
      setResult(newResult)
      setFlipCount(prev => prev + 1)
      setStats(prev => ({
        ...prev,
        [newResult]: prev[newResult] + 1
      }))
      setIsFlipping(false)
      setToastMessage(`It's ${newResult}!`)
      setShowToast(true)
    }, flipDuration)
  }

  const resetStats = () => {
    setFlipCount(0)
    setStats({ heads: 0, tails: 0 })
    setResult(null)
    setToastMessage('Statistics reset')
    setShowToast(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="flex justify-center">
              <div
                className={`w-40 h-40 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 flex items-center justify-center text-2xl font-bold shadow-lg transform transition-all duration-1000 ${
                  isFlipping ? 'animate-flip' : ''
                }`}
              >
                {isFlipping ? (
                  <div className="animate-pulse">Flipping...</div>
                ) : result ? (
                  <div className="capitalize">{result}</div>
                ) : (
                  <div className="text-gray-500">Click to Flip</div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={flipCoin}
                disabled={isFlipping}
                className={`px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isFlipping
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                }`}
              >
                Flip Coin
              </button>
              <button
                onClick={resetStats}
                className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {stats.heads}
                  </div>
                  <div className="text-sm text-gray-500">Heads</div>
                </div>
                <div className="bg-white p-4 rounded-md text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {stats.tails}
                  </div>
                  <div className="text-sm text-gray-500">Tails</div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-600">
                Total Flips: {flipCount}
              </div>
              {flipCount > 0 && (
                <div className="text-center text-sm text-gray-600">
                  Heads: {((stats.heads / flipCount) * 100).toFixed(1)}% |
                  Tails: {((stats.tails / flipCount) * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">1. Flip the Coin</h4>
                <p className="text-sm text-gray-600">
                  Click the "Flip Coin" button to start the animation.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">2. View Results</h4>
                <p className="text-sm text-gray-600">
                  Watch the coin flip and see whether it lands on heads or tails.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">3. Track Statistics</h4>
                <p className="text-sm text-gray-600">
                  Monitor the distribution of results and reset when needed.
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

      <style jsx>{`
        @keyframes flip {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(1800deg); }
        }
        .animate-flip {
          animation: flip 2s ease-in-out;
        }
      `}</style>
    </div>
  )
} 