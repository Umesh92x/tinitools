import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Heart Rate Zone Calculator',
  description: 'Free heart rate zone calculator - Calculate your training zones based on age and resting heart rate. Perfect for optimizing workouts. No signup required.',
  path: '/health-fitness/heart-rate',
  keywords: ['heart rate calculator', 'heart rate zones', 'training zones', 'target heart rate', 'hrr calculator', 'karvonen formula'],
})
