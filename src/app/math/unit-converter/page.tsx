import { UnitConverter } from '@/components/tools/math/UnitConverter'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Unit Converter',
  description: 'Free online unit converter for length, weight, temperature, area, volume, and speed. Convert between different units of measurement easily.',
  keywords: ['unit converter', 'measurement converter', 'length converter', 'weight converter', 'temperature converter', 'area converter', 'volume converter', 'speed converter'],
})

export default function UnitConverterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Unit Converter</h1>
        <p className="mt-4 text-xl text-gray-600">
          Convert between different units of measurement quickly and accurately
        </p>
      </div>

      <UnitConverter />

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Conversions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Length</h3>
            <p className="text-sm text-gray-600">
              Convert between mm, cm, m, km, inches, feet, yards, and miles
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Weight</h3>
            <p className="text-sm text-gray-600">
              Convert between mg, g, kg, oz, lb, and stone
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Temperature</h3>
            <p className="text-sm text-gray-600">
              Convert between Celsius, Fahrenheit, and Kelvin
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Area</h3>
            <p className="text-sm text-gray-600">
              Convert between mm², cm², m², km², in², ft², yd², and acres
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Volume</h3>
            <p className="text-sm text-gray-600">
              Convert between mL, L, m³, fl oz, cups, pints, quarts, and gallons
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Speed</h3>
            <p className="text-sm text-gray-600">
              Convert between m/s, km/h, mph, and knots
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 