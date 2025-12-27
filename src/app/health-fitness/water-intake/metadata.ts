import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Water Intake Calculator',
  description: 'Free water intake calculator - Calculate your daily water needs based on weight, activity level, and climate. Get personalized hydration recommendations. No signup required.',
  path: '/health-fitness/water-intake',
  keywords: ['water intake calculator', 'daily water intake', 'hydration calculator', 'water needs', 'how much water to drink'],
}) 