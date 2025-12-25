import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { DiceRoller } from '@/components/tools/misc/DiceRoller'

export const metadata: Metadata = generateMetadata({
  title: 'Dice Roller',
  description: 'Roll virtual dice with multiple types. Support for D4, D6, D8, D10, D12, D20, and D100 dice.',
  path: '/misc/dice',
  keywords: ['dice roller', 'roll dice', 'virtual dice', 'dnd dice'],
})

export default function DiceRollerPage() {
  return (
    <ToolLayout
      title="Dice Roller"
      description="Roll virtual dice with multiple types. Support for D4, D6, D8, D10, D12, D20, and D100 dice."
    >
      <DiceRoller />
    </ToolLayout>
  )
}

