import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Calculator,
  ArrowRightLeft,
  Percent,
  Scale,
  CalendarDays,
  DollarSign
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Math & Calculations',
  description: 'Calculators and converters for everyday calculations',
  path: '/math',
  keywords: ['calculator', 'unit converter', 'percentage calculator', 'BMI calculator', 'age calculator', 'tip calculator'],
})

export default function MathTools() {
const tools = [
  {
      title: 'Calculator with History',
    description: 'A full-featured calculator with operation history and memory functions.',
    href: '/math/calculator',
      icon: Calculator,
  },
  {
      title: 'Unit Converter',
    description: 'Convert between different units of length, weight, temperature, and more.',
    href: '/math/unit-converter',
      icon: ArrowRightLeft,
  },
  {
      title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage changes, and percentage differences.',
    href: '/math/percentage',
      icon: Percent,
  },
  {
      title: 'BMI Calculator',
    description: 'Calculate Body Mass Index (BMI) and get health insights.',
    href: '/math/bmi',
      icon: Scale,
  },
  {
      title: 'Age Calculator',
    description: 'Calculate age between two dates with years, months, and days.',
    href: '/math/age',
      icon: CalendarDays,
  },
  {
      title: 'Tip Calculator',
    description: 'Calculate tips and split bills among multiple people.',
    href: '/math/tip',
      icon: DollarSign,
  },
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Math & Calculations
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Calculators and converters for everyday calculations
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 