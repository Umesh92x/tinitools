import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Exercise Rep Counter',
  description: 'Free exercise rep counter - Track your exercise repetitions with built-in timer. Set custom rest periods between sets. Perfect for workouts. No signup required.',
  path: '/health-fitness/rep-counter',
  keywords: ['rep counter', 'exercise counter', 'workout tracker', 'repetition counter', 'fitness tracker'],
}) 