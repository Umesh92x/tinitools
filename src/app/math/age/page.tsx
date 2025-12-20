import { AgeCalculator } from '@/components/tools/math/AgeCalculator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Age Calculator',
  description: 'Calculate age between two dates with precise years, months, and days. Get total months, weeks, days, and next birthday information.',
  keywords: ['age calculator', 'date calculator', 'birthday calculator', 'age difference', 'next birthday calculator'],
})

export default function AgeCalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Age Calculator</h1>
        <p className="mt-4 text-xl text-gray-600">
          Calculate exact age or time between any two dates
        </p>
      </div>

      <AgeCalculator />

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Precise Age Calculation</h3>
            <p className="text-sm text-gray-600">
              Get accurate age in years, months, and days between any two dates
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Total Time Units</h3>
            <p className="text-sm text-gray-600">
              View total months, weeks, and days between dates
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Next Birthday</h3>
            <p className="text-sm text-gray-600">
              Find out when your next birthday is and how many days until then
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Flexible Dates</h3>
            <p className="text-sm text-gray-600">
              Calculate age from birth to any future or past date
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-sm text-gray-600">
              Simple interface with date pickers and instant results
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Multiple Uses</h3>
            <p className="text-sm text-gray-600">
              Perfect for age verification, event planning, or general curiosity
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 