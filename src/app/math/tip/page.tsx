import { TipCalculator } from '@/components/tools/math/TipCalculator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Tip Calculator',
  description: 'Calculate tips and split bills easily. Features customizable tip percentages and bill splitting for groups.',
  keywords: ['tip calculator', 'bill splitter', 'gratuity calculator', 'restaurant calculator', 'tip percentage calculator'],
})

export default function TipCalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Tip Calculator</h1>
        <p className="mt-4 text-xl text-gray-600">
          Calculate tips and split bills with ease
        </p>
      </div>

      <TipCalculator />

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Quick Tip Selection</h3>
            <p className="text-sm text-gray-600">
              Choose from common tip percentages or enter a custom amount
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Bill Splitting</h3>
            <p className="text-sm text-gray-600">
              Easily split the total bill and tip among any number of people
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Per Person Breakdown</h3>
            <p className="text-sm text-gray-600">
              See individual shares for both the tip and total amount
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Custom Tips</h3>
            <p className="text-sm text-gray-600">
              Enter any custom tip percentage for precise calculations
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-sm text-gray-600">
              Results update instantly as you modify values
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Easy Reset</h3>
            <p className="text-sm text-gray-600">
              Clear all fields and start a new calculation with one click
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 