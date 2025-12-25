import { Metadata } from 'next'
import { FlashcardGenerator } from '@/components/tools/educational/FlashcardGenerator'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Flashcard Generator - Free Online Flashcard Maker',
  description: 'Create and study flashcards online. Perfect for memorizing terms, definitions, and concepts. Supports import/export and shuffle mode.',
  keywords: 'flashcard generator, flashcard maker, online flashcards, study cards, memory cards',
}

export default function FlashcardGeneratorPage() {
  return (
    <ToolLayout
      title="Flashcard Generator"
      description="Create and study flashcards online. Perfect for memorizing terms, definitions, and concepts. Supports import/export, shuffle mode, and local storage."
    >
      <FlashcardGenerator />
    </ToolLayout>
  )
}

