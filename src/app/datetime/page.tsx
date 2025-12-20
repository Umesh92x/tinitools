import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Calendar,
  Clock,
  Timer,
  CalendarDays,
  Globe,
  Briefcase,
  CalendarClock
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Date & Time Tools',
  description: 'Free online tools for working with dates, times, and time zones',
  path: '/datetime',
  keywords: ['date calculator', 'time converter', 'countdown timer', 'world clock'],
})

export default function DateTimeTools() {
const tools = [
  {
      title: 'Date Calculator',
      description: 'Calculate differences between dates, add or subtract days, and more.',
      href: '/datetime/calculator',
      icon: Calendar,
    },
    {
      title: 'World Clock',
      description: 'View current time in different time zones around the world.',
    href: '/datetime/world-clock',
      icon: Globe,
  },
  {
      title: 'Countdown Timer',
      description: 'Create countdown timers for events and deadlines.',
      href: '/datetime/countdown',
      icon: Timer,
  },
  {
      title: 'Calendar',
      description: 'View calendar with holidays and important dates.',
      href: '/datetime/calendar',
      icon: CalendarDays,
  },
  {
      title: 'Business Days Calculator',
    description: 'Calculate working days between dates, excluding weekends and holidays.',
    href: '/datetime/business-days',
      icon: Briefcase,
  },
  {
      title: 'Meeting Planner',
      description: 'Plan meetings across different time zones.',
      href: '/datetime/meeting-planner',
      icon: CalendarClock,
  },
  {
      title: 'Epoch Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    href: '/datetime/epoch',
      icon: Clock,
  },
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Date & Time Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Free online tools for working with dates, times, and time zones
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 