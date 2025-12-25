import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Dice5,
  Coins,
  Timer,
  Dice1,
  Clock,
  Hourglass
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Misc Tools',
  description: 'Useful utilities including random generators, timers, and decision-making tools.',
  path: '/misc',
  keywords: ['random number generator', 'coin flip', 'pomodoro timer', 'dice roller', 'stopwatch', 'countdown timer', 'utilities'],
})

export default function MiscTools() {
const tools = [
  {
      title: 'Random Number Generator',
    description: 'Generate random numbers with custom ranges, decimal places, presets, and history tracking.',
    href: '/misc/random',
      icon: Dice5,
  },
  {
      title: 'Coin Flip',
    description: 'Flip virtual coins with animation. Flip multiple coins at once and track statistics.',
    href: '/misc/coin-flip',
      icon: Coins,
  },
  {
      title: 'Pomodoro Timer',
    description: 'Stay focused with customizable Pomodoro timer. Set work and break intervals with notifications.',
    href: '/misc/pomodoro',
      icon: Timer,
  },
  {
      title: 'Dice Roller',
    description: 'Roll virtual dice with multiple types. Support for D4, D6, D8, D10, D12, D20, and D100 dice.',
    href: '/misc/dice',
      icon: Dice1,
  },
  {
      title: 'Stopwatch',
    description: 'Precise stopwatch with lap timer functionality. Track time with millisecond accuracy.',
    href: '/misc/stopwatch',
      icon: Clock,
  },
  {
      title: 'Countdown Timer',
    description: 'Set a countdown timer with custom hours, minutes, and seconds. Get notified when time is up.',
    href: '/misc/countdown',
      icon: Hourglass,
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