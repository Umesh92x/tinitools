import { Metadata } from 'next'
import { FlashcardGenerator } from '@/components/tools/educational/FlashcardGenerator'
import ToolLayout from '@/components/layout/ToolLayout'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Flashcard Generator',
  description: 'Free flashcard generator - Create and study flashcards online instantly. Perfect for memorizing terms, definitions, and concepts. Supports import/export and shuffle mode. No signup required.',
  path: '/educational/flashcards',
  keywords: ['flashcard generator', 'flashcard maker', 'online flashcards', 'study cards', 'memory cards'],
})

export default function FlashcardGeneratorPage() {
  const relatedTools = [
    { name: 'Grade Calculator', href: '/educational/grade-calculator' },
    { name: 'GPA Calculator', href: '/educational/gpa-calculator' },
    { name: 'Multiplication Table', href: '/educational/multiplication-table' },
    { name: 'Math Formula Sheet', href: '/educational/math-formulas' },
  ]

  return (
    <ToolLayout
      title="Flashcard Generator"
      description="Free flashcard generator - Create and study flashcards online instantly. Perfect for memorizing terms, definitions, and concepts. Supports import/export and shuffle mode. No signup required."
      category="educational"
      categoryName="Educational Tools"
      relatedTools={relatedTools}
    >
      <FlashcardGenerator />
    </ToolLayout>
  )
}

