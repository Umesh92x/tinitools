import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Calculator,
  DollarSign,
  Building2,
  Percent,
  IndianRupee,
  Users,
  Receipt,
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Financial Tools',
  description: 'Free online financial calculators and tools for managing money, investments, and taxes',
  path: '/financial',
  keywords: ['financial calculator', 'investment tools', 'tax calculator', 'EMI calculator'],
})

export default function FinancialTools() {
const tools = [
  {
      title: 'Compound Interest',
      description: 'Calculate compound interest and see how your investments grow over time.',
      href: '/financial/compound-interest',
      icon: Calculator,
    },
    {
      title: 'Currency Converter',
      description: 'Convert between different currencies using real-time exchange rates.',
      href: '/financial/currency',
      icon: DollarSign,
  },
  {
      title: 'EMI Calculator',
      description: 'Calculate EMI for loans with customizable interest rates and tenure.',
      href: '/financial/emi',
      icon: Building2,
  },
  {
      title: 'GST Calculator',
      description: 'Calculate GST amounts and final prices for products and services.',
      href: '/financial/gst',
      icon: Percent,
  },
  {
      title: 'Investment Calculator',
      description: 'Plan your investments and calculate potential returns.',
    href: '/financial/investment',
      icon: IndianRupee,
  },
  {
      title: 'Split Bill Calculator',
      description: 'Split bills and expenses among friends and groups.',
      href: '/financial/split-bill',
      icon: Users,
  },
  {
      title: 'Tax Calculator',
    description: 'Calculate income tax based on your income and deductions.',
    href: '/financial/tax',
      icon: Receipt,
  },
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Financial Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Free online financial calculators and tools for managing money, investments, and taxes
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 