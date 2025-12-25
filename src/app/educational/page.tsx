import CategoryLayout from '@/components/layout/CategoryLayout'
import { Calculator, Table2, Atom, BookOpen, Award, GraduationCap, FileText } from 'lucide-react'

export const metadata = {
  title: 'Educational Tools - TiniTools',
  description: 'A collection of educational tools for learning and teaching. Includes calculators, study tools, and reference materials.',
}

const tools = [
  {
    name: 'Multiplication Table Generator',
    description: 'Generate multiplication tables with practice mode and quiz. Perfect for learning math.',
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
  {
    name: 'Grade Calculator',
    description: 'Calculate your final grade with weighted assignments and exams.',
    icon: Award,
    href: '/educational/grade-calculator',
  },
  {
    name: 'GPA Calculator',
    description: 'Calculate your GPA (Grade Point Average) with multiple courses.',
    icon: GraduationCap,
    href: '/educational/gpa-calculator',
  },
  {
    name: 'Flashcard Generator',
    description: 'Create and study flashcards online. Perfect for memorizing terms and concepts.',
    icon: FileText,
    href: '/educational/flashcards',
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