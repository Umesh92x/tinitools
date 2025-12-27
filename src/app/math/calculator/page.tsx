import { Calculator } from '@/components/tools/math/Calculator'
import { generateMetadata } from '@/lib/metadata'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export const metadata = generateMetadata({
  title: 'Calculator with History',
  description: 'Free online calculator with history and memory functions - Perform basic and advanced calculations with a clean interface. No signup required.',
  path: '/math/calculator',
  keywords: ['calculator', 'online calculator', 'calculator with history', 'memory calculator', 'math calculator'],
})

export default function CalculatorPage() {
  const relatedTools = [
    { name: 'Percentage Calculator', href: '/math/percentage' },
    { name: 'Unit Converter', href: '/math/unit-converter' },
    { name: 'BMI Calculator', href: '/math/bmi' },
    { name: 'Tip Calculator', href: '/math/tip' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Calculator with History"
        description="Free online calculator with history and memory functions - Perform basic and advanced calculations with a clean interface. No signup required."
        category="Math & Calculations"
        url="/math/calculator"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Math & Calculations', href: '/math' },
          { label: 'Calculator with History' },
        ]} />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Calculator with History</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            A full-featured calculator with operation history and memory functions
          </p>
        </div>

        <Calculator />

      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li>• Basic arithmetic operations (addition, subtraction, multiplication, division)</li>
          <li>• Percentage calculations</li>
          <li>• Memory functions (M+, M-, MR, MC)</li>
          <li>• Operation history with timestamps</li>
          <li>• Clear and delete functions</li>
          <li>• Decimal point support</li>
        </ul>
      </div>
      <RelatedTools tools={relatedTools} currentTool="/math/calculator" />
    </div>
    </>
  )
} 