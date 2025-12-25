import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { RandomNumberGenerator } from '@/components/tools/misc/RandomNumberGenerator'

export const metadata: Metadata = generateMetadata({
  title: 'Random Number Generator',
  description: 'Generate random numbers with custom ranges, decimal places, presets, and multiple numbers at once.',
  path: '/misc/random',
  keywords: ['random number', 'number generator', 'random generator'],
})

export default function RandomNumberGeneratorPage() {
  return (
    <ToolLayout
      title="Random Number Generator"
      description="Generate random numbers with custom ranges, decimal places, presets, and multiple numbers at once."
    >
      <RandomNumberGenerator />
    </ToolLayout>
  )
} 