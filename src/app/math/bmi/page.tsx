import { BMICalculator } from '@/components/tools/math/BMICalculator'
import { generateMetadata } from '@/lib/metadata'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export const metadata = generateMetadata({
  title: 'BMI Calculator',
  description: 'Free BMI calculator - Calculate your Body Mass Index using metric or imperial units instantly. Get instant health insights based on your BMI score. No signup required.',
  path: '/math/bmi',
  keywords: ['BMI calculator', 'body mass index', 'BMI', 'health calculator', 'weight calculator', 'BMI categories', 'BMI chart'],
})

export default function BMICalculatorPage() {
  const relatedTools = [
    { name: 'Calorie Calculator', href: '/health-fitness/calorie-calculator' },
    { name: 'Calculator', href: '/math/calculator' },
    { name: 'Unit Converter', href: '/math/unit-converter' },
    { name: 'Age Calculator', href: '/math/age' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="BMI Calculator"
        description="Free BMI calculator - Calculate your Body Mass Index using metric or imperial units instantly. Get instant health insights based on your BMI score. No signup required."
        category="Math & Calculations"
        url="/math/bmi"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Math & Calculations', href: '/math' },
          { label: 'BMI Calculator' },
        ]} />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">BMI Calculator</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Calculate your Body Mass Index (BMI) and understand what it means for your health
          </p>
        </div>

        <BMICalculator />

      <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About BMI</h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <p>
            Body Mass Index (BMI) is a simple measure that uses your height and weight to work out if your weight is healthy.
            The BMI calculation divides an adult's weight in kilograms by their height in metres squared.
          </p>
          <p>
            While BMI is a useful measurement for most people, it has some limitations:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>It may not be accurate for athletes or people with high muscle mass</li>
            <li>The normal range may not be suitable for all ethnic groups</li>
            <li>It is not applicable for children and young people under 18</li>
            <li>It does not account for where fat is stored in the body</li>
          </ul>
          <p>
            For a more accurate assessment of your health status, consult with a healthcare professional who can take into account other factors such as your age, ethnicity, fitness level, and overall health condition.
          </p>
        </div>
      </div>
      <RelatedTools tools={relatedTools} currentTool="/math/bmi" />
    </div>
    </>
  )
} 