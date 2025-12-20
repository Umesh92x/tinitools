import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Dumbbell,
  Droplet,
  Timer,
  Moon,
  Heart
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Health & Fitness Tools',
  description: 'Free online tools for health, fitness, and wellness tracking',
  path: '/health-fitness',
  keywords: ['health tools', 'fitness tools', 'wellness calculator', 'health tracker'],
})

export default function HealthFitnessTools() {
const tools = [
  {
    title: 'Calorie Calculator',
      description: 'Calculate your daily calorie needs based on your age, weight, height, and activity level.',
    href: '/health-fitness/calorie-calculator',
      icon: Dumbbell,
  },
  {
    title: 'Water Intake Calculator',
      description: 'Calculate your recommended daily water intake based on your weight and activity level.',
    href: '/health-fitness/water-intake',
      icon: Droplet,
  },
  {
      title: 'Rep Counter',
      description: 'Simple tool to count and track your exercise repetitions during workouts.',
    href: '/health-fitness/rep-counter',
      icon: Timer,
  },
  {
      title: 'Sleep Calculator',
    description: 'Calculate optimal bedtime and wake-up times based on sleep cycles.',
    href: '/health-fitness/sleep-calculator',
      icon: Moon,
  },
  {
      title: 'Heart Rate Zones',
    description: 'Calculate your target heart rate zones for different types of exercise.',
    href: '/health-fitness/heart-rate',
      icon: Heart,
  },
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Health & Fitness Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Free online tools for health, fitness, and wellness tracking
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 