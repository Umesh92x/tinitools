import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Dice5,
  Coins,
  Timer
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Misc Tools',
  description: 'Other useful utilities',
  path: '/misc',
  keywords: ['random number generator', 'coin flip', 'pomodoro timer', 'utilities'],
})

export default function MiscTools() {
const tools = [
  {
      title: 'Random Number Generator',
    description: 'Generate random numbers with custom ranges, decimal places, and multiple numbers at once.',
    href: '/misc/random',
      icon: Dice5,
  },
  {
      title: 'Coin Flip',
    description: 'Flip a virtual coin with animation. Perfect for making quick decisions.',
    href: '/misc/coin-flip',
      icon: Coins,
  },
  {
      title: 'Pomodoro Timer',
    description: 'Stay focused with customizable Pomodoro timer. Set work and break intervals with notifications.',
    href: '/misc/pomodoro',
      icon: Timer,
    }
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Misc Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Other useful utilities
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 