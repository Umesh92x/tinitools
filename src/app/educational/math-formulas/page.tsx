import { Metadata } from 'next'
import MathFormulaSheet from '@/components/tools/educational/MathFormulaSheet'
import { generateMetadata } from '@/lib/metadata'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export const metadata: Metadata = generateMetadata({
  title: 'Math Formula Sheet',
  description: 'Free math formula sheet - A comprehensive collection of mathematical formulas and equations for quick reference, including algebra, geometry, calculus, and more. No signup required.',
  path: '/educational/math-formulas',
  keywords: ['math formulas', 'equations', 'algebra', 'geometry', 'calculus', 'mathematics', 'reference'],
})

export default function MathFormulaPage() {
  const relatedTools = [
    { name: 'Scientific Calculator', href: '/educational/calculator' },
    { name: 'Multiplication Table', href: '/educational/multiplication-table' },
    { name: 'Grade Calculator', href: '/educational/grade-calculator' },
    { name: 'Periodic Table Explorer', href: '/educational/periodic-table' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Math Formula Sheet"
        description="Free math formula sheet - A comprehensive collection of mathematical formulas and equations for quick reference, including algebra, geometry, calculus, and more. No signup required."
        category="Educational Tools"
        url="/educational/math-formulas"
      />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Educational Tools', href: '/educational' },
            { label: 'Math Formula Sheet' },
          ]} />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Math Formula Sheet
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              A comprehensive collection of mathematical formulas and equations for quick reference.
            </p>
          </div>
          <MathFormulaSheet />
          <RelatedTools tools={relatedTools} currentTool="/educational/math-formulas" />
        </div>
      </div>
    </>
  )
} 