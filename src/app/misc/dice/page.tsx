import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { DiceRoller } from '@/components/tools/misc/DiceRoller'

export const metadata: Metadata = generateMetadata({
  title: 'Dice Roller',
  description: 'Free dice roller - Roll virtual dice with multiple types instantly. Support for D4, D6, D8, D10, D12, D20, and D100 dice. No signup required.',
  path: '/misc/dice',
  keywords: ['dice roller', 'roll dice', 'virtual dice', 'dnd dice'],
})

export default function DiceRollerPage() {
  const relatedTools = [
    { name: 'Coin Flip', href: '/misc/coin-flip' },
    { name: 'Random Number Generator', href: '/misc/random' },
    { name: 'Stopwatch', href: '/misc/stopwatch' },
    { name: 'Countdown Timer', href: '/misc/countdown' },
  ]

  return (
    <ToolLayout
      title="Dice Roller"
      description="Free dice roller - Roll virtual dice with multiple types instantly. Support for D4, D6, D8, D10, D12, D20, and D100 dice. No signup required."
      category="misc"
      categoryName="Misc Tools"
      relatedTools={relatedTools}
    >
      <DiceRoller />
    </ToolLayout>
  )
}

