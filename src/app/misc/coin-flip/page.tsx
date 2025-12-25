import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { CoinFlipper } from '@/components/tools/misc/CoinFlipper'

export const metadata: Metadata = generateMetadata({
  title: 'Coin Flip',
  description: 'Flip virtual coins with animation. Flip multiple coins at once and track statistics.',
  path: '/misc/coin-flip',
  keywords: ['coin flip', 'coin toss', 'heads or tails', 'random decision'],
})

export default function CoinFlipPage() {
  return (
    <ToolLayout
      title="Coin Flip"
      description="Flip virtual coins with animation. Flip multiple coins at once and track statistics."
    >
      <CoinFlipper />
    </ToolLayout>
  )
} 