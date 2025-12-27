import { Metadata } from 'next'
import PeriodicTableExplorer from '@/components/tools/educational/PeriodicTableExplorer'
import { generateMetadata } from '@/lib/metadata'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export const metadata: Metadata = generateMetadata({
  title: 'Periodic Table Explorer',
  description: 'Free periodic table explorer - Explore the periodic table of elements with detailed information about atomic structure, properties, and uses instantly. No signup required.',
  path: '/educational/periodic-table',
  keywords: ['periodic table', 'chemical elements', 'chemistry', 'atomic number', 'atomic mass', 'electron configuration'],
})

export default function PeriodicTablePage() {
  const relatedTools = [
    { name: 'Math Formula Sheet', href: '/educational/math-formulas' },
    { name: 'Scientific Calculator', href: '/educational/calculator' },
    { name: 'Flashcard Generator', href: '/educational/flashcards' },
    { name: 'Multiplication Table', href: '/educational/multiplication-table' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Periodic Table Explorer"
        description="Free periodic table explorer - Explore the periodic table of elements with detailed information about atomic structure, properties, and uses instantly. No signup required."
        category="Educational Tools"
        url="/educational/periodic-table"
      />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Educational Tools', href: '/educational' },
            { label: 'Periodic Table Explorer' },
          ]} />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Periodic Table Explorer
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Explore the periodic table of elements with detailed information about each element.
            </p>
          </div>
          <PeriodicTableExplorer />
          <RelatedTools tools={relatedTools} currentTool="/educational/periodic-table" />
        </div>
      </div>
    </>
  )
} 