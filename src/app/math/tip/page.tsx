import { TipCalculator } from '@/components/tools/math/TipCalculator'
import { generateMetadata } from '@/lib/metadata'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export const metadata = generateMetadata({
  title: 'Tip Calculator',
  description: 'Free tip calculator - Calculate tips and split bills easily. Features customizable tip percentages and bill splitting for groups. No signup required.',
  path: '/math/tip',
  keywords: ['tip calculator', 'bill splitter', 'gratuity calculator', 'restaurant calculator', 'tip percentage calculator'],
})

export default function TipCalculatorPage() {
  const relatedTools = [
    { name: 'Split Bill Calculator', href: '/financial/split-bill' },
    { name: 'Calculator', href: '/math/calculator' },
    { name: 'Percentage Calculator', href: '/math/percentage' },
    { name: 'Unit Converter', href: '/math/unit-converter' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Tip Calculator"
        description="Free tip calculator - Calculate tips and split bills easily. Features customizable tip percentages and bill splitting for groups. No signup required."
        category="Math & Calculations"
        url="/math/tip"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Math & Calculations', href: '/math' },
          { label: 'Tip Calculator' },
        ]} />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tip Calculator</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Calculate tips and split bills with ease
          </p>
        </div>

        <TipCalculator />

      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Quick Tip Selection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Choose from common tip percentages or enter a custom amount
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Bill Splitting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Easily split the total bill and tip among any number of people
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Per Person Breakdown</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              See individual shares for both the tip and total amount
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Custom Tips</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Enter any custom tip percentage for precise calculations
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Real-time Updates</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Results update instantly as you modify values
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Easy Reset</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Clear all fields and start a new calculation with one click
            </p>
          </div>
        </div>
      </div>
      <RelatedTools tools={relatedTools} currentTool="/math/tip" />
    </div>
    </>
  )
} 