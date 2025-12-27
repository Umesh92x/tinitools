import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Sleep Time Calculator',
  description: 'Free sleep time calculator - Calculate optimal bedtime and wake-up times based on sleep cycles. Get personalized recommendations for better sleep. No signup required.',
  path: '/health-fitness/sleep-calculator',
  keywords: ['sleep calculator', 'bedtime calculator', 'wake up time calculator', 'sleep cycles', 'sleep schedule'],
}) 