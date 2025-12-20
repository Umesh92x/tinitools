import { Calculator } from '@/components/tools/math/Calculator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Calculator with History',
  description: 'Free online calculator with history and memory functions. Perform basic and advanced calculations with a clean interface.',
  keywords: ['calculator', 'online calculator', 'calculator with history', 'memory calculator', 'math calculator'],
})

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Calculator with History</h1>
        <p className="mt-4 text-xl text-gray-600">
          A full-featured calculator with operation history and memory functions
        </p>
      </div>

      <Calculator />

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <ul className="space-y-2 text-gray-600">
          <li>• Basic arithmetic operations (addition, subtraction, multiplication, division)</li>
          <li>• Percentage calculations</li>
          <li>• Memory functions (M+, M-, MR, MC)</li>
          <li>• Operation history with timestamps</li>
          <li>• Clear and delete functions</li>
          <li>• Decimal point support</li>
        </ul>
      </div>
    </div>
  )
} 