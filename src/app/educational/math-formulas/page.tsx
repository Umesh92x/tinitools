import { Metadata } from 'next'
import MathFormulaSheet from '@/components/tools/educational/MathFormulaSheet'

export const metadata: Metadata = {
  title: 'Math Formula Sheet | TiniTools',
  description: 'A comprehensive collection of mathematical formulas and equations for quick reference, including algebra, geometry, calculus, and more.',
  keywords: ['math formulas', 'equations', 'algebra', 'geometry', 'calculus', 'mathematics', 'reference'],
}

export default function MathFormulaPage() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Math Formula Sheet
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A comprehensive collection of mathematical formulas and equations for quick reference.
          </p>
        </div>
        <MathFormulaSheet />
      </div>
    </div>
  )
} 