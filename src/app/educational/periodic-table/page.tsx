import { Metadata } from 'next'
import PeriodicTableExplorer from '@/components/tools/educational/PeriodicTableExplorer'

export const metadata: Metadata = {
  title: 'Periodic Table Explorer | TiniTools',
  description: 'Explore the periodic table of elements with detailed information about atomic structure, properties, and uses of each element.',
  keywords: ['periodic table', 'chemical elements', 'chemistry', 'atomic number', 'atomic mass', 'electron configuration'],
}

export default function PeriodicTablePage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Periodic Table Explorer
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore the periodic table of elements with detailed information about each element.
          </p>
        </div>
        <PeriodicTableExplorer />
      </div>
    </div>
  )
} 