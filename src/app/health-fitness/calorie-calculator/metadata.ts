import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Calorie Calculator',
  description: 'Free calorie calculator - Calculate your daily calorie needs based on age, weight, height, activity level, and goals. Get personalized diet plans. No signup required.',
  path: '/health-fitness/calorie-calculator',
  keywords: ['calorie calculator', 'daily calories', 'bmr calculator', 'tdee calculator', 'calorie needs', 'diet calculator'],
}) 