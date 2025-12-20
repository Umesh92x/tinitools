import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = generateMetadata({
  title: 'Coin Flip',
  description: 'Flip a virtual coin with animation. Perfect for making quick decisions.',
  path: '/misc/coin-flip',
  keywords: ['coin flip', 'coin toss', 'heads or tails', 'random decision'],
})

export default function CoinFlip() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-50 rounded-full">
              <Coins className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Coin Flip
          </h1>
          <p className="text-lg text-gray-600">
            Flip a virtual coin with animation. Perfect for making quick decisions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col items-center space-y-8">
            <div className="w-48 h-48 bg-indigo-50 rounded-full flex items-center justify-center">
              <div className="text-6xl font-bold text-indigo-600">
                ?
              </div>
            </div>

            <div className="space-y-4 w-full">
              <Button className="w-full text-lg py-6" size="lg">
                Flip Coin
              </Button>

              <div className="text-center">
                <div className="text-sm text-gray-500">
                  Statistics
                </div>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="font-medium">Heads</div>
                    <div className="text-gray-500">0 (0%)</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="font-medium">Tails</div>
                    <div className="text-gray-500">0 (0%)</div>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Reset Statistics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 