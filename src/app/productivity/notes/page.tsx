import { Metadata } from 'next'
import { NoteTaking } from '@/components/tools/productivity/NoteTaking'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Note Taking - Free Online Notes App',
  description: 'Free online note taking app with tags, categories, search, and local storage. Take and save notes that persist across browser sessions.',
  keywords: 'note taking, notes app, online notes, local storage notes, free notes app, note organizer',
}

export default function NoteTakingPage() {
  return (
    <ToolLayout
      title="Note Taking"
      description="Take and save notes with tags, categories, search functionality, and local storage persistence. Import and export notes easily."
    >
      <NoteTaking />
    </ToolLayout>
  )
} 