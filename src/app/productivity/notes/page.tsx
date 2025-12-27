import { Metadata } from 'next'
import { NoteTaking } from '@/components/tools/productivity/NoteTaking'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Note Taking',
  description: 'Free online note taking app - Take and save notes with tags, categories, search, and local storage instantly. Notes persist across browser sessions. No signup required.',
  path: '/productivity/notes',
  keywords: ['note taking', 'notes app', 'online notes', 'local storage notes', 'free notes app', 'note organizer'],
})

export default function NoteTakingPage() {
  const relatedTools = [
    { name: 'Todo List', href: '/productivity/todo' },
    { name: 'Habit Tracker', href: '/productivity/habits' },
    { name: 'Goal Tracker', href: '/productivity/goal-tracker' },
    { name: 'Time Tracker', href: '/productivity/time-tracker' },
  ]

  return (
    <ToolLayout
      title="Note Taking"
      description="Free online note taking app - Take and save notes with tags, categories, search, and local storage instantly. Notes persist across browser sessions. No signup required."
      category="productivity"
      categoryName="Productivity Tools"
      relatedTools={relatedTools}
    >
      <NoteTaking />
    </ToolLayout>
  )
} 