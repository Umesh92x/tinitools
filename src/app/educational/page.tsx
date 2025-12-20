import CategoryLayout from '@/components/layout/CategoryLayout'
import { Calculator, Table2, Atom, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Educational Tools - TiniTools',
  description: 'A collection of educational tools for learning and teaching.',
}

const tools = [
  {
    name: 'Multiplication Table Generator',
    description: 'Generate multiplication tables with customizable ranges and formats.',
    icon: Table2,
    href: '/educational/multiplication-table',
  },
  {
    name: 'Periodic Table Explorer',
    description: 'Interactive periodic table with detailed element information and properties.',
    icon: Atom,
    href: '/educational/periodic-table',
  },
  {
    name: 'Math Formula Sheet',
    description: 'Comprehensive collection of mathematical formulas and equations.',
    icon: BookOpen,
    href: '/educational/math-formulas',
  },
  {
    name: 'Scientific Calculator',
    description: 'Advanced calculator with scientific functions and unit conversions.',
    icon: Calculator,
    href: '/educational/calculator',
  },
]

export default function EducationalToolsPage() {
  return (
    <CategoryLayout
      title="Educational Tools"
      description="A collection of tools to help with learning and teaching."
      tools={tools}
    />
  )
} 