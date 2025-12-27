import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { RandomNumberGenerator } from '@/components/tools/misc/RandomNumberGenerator'

export const metadata: Metadata = generateMetadata({
  title: 'Random Number Generator',
  description: 'Free random number generator - Generate random numbers with custom ranges, decimal places, presets, and multiple numbers at once instantly. No signup required.',
  path: '/misc/random',
  keywords: ['random number', 'number generator', 'random generator'],
})

export default function RandomNumberGeneratorPage() {
  const relatedTools = [
    { name: 'Dice Roller', href: '/misc/dice' },
    { name: 'Coin Flip', href: '/misc/coin-flip' },
    { name: 'Stopwatch', href: '/misc/stopwatch' },
    { name: 'Countdown Timer', href: '/misc/countdown' },
  ]

  return (
    <ToolLayout
      title="Random Number Generator"
      description="Free random number generator - Generate random numbers with custom ranges, decimal places, presets, and multiple numbers at once instantly. No signup required."
      category="misc"
      categoryName="Misc Tools"
      relatedTools={relatedTools}
    >
      <RandomNumberGenerator />
    </ToolLayout>
  )
} 