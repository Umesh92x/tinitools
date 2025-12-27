import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { CoinFlipper } from '@/components/tools/misc/CoinFlipper'

export const metadata: Metadata = generateMetadata({
  title: 'Coin Flip',
  description: 'Free coin flip tool - Flip virtual coins with animation instantly. Flip multiple coins at once and track statistics. No signup required.',
  path: '/misc/coin-flip',
  keywords: ['coin flip', 'coin toss', 'heads or tails', 'random decision'],
})

export default function CoinFlipPage() {
  const relatedTools = [
    { name: 'Dice Roller', href: '/misc/dice' },
    { name: 'Random Number Generator', href: '/misc/random' },
    { name: 'Stopwatch', href: '/misc/stopwatch' },
    { name: 'Pomodoro Timer', href: '/misc/pomodoro' },
  ]

  return (
    <ToolLayout
      title="Coin Flip"
      description="Free coin flip tool - Flip virtual coins with animation instantly. Flip multiple coins at once and track statistics. No signup required."
      category="misc"
      categoryName="Misc Tools"
      relatedTools={relatedTools}
    >
      <CoinFlipper />
    </ToolLayout>
  )
} 