import { Metadata } from 'next'
import { MultiplicationTable } from '@/components/tools/educational/MultiplicationTable'
import ToolLayout from '@/components/layout/ToolLayout'

export const metadata: Metadata = {
  title: 'Multiplication Table Generator - TiniTools',
  description: 'Generate customizable multiplication tables with practice mode and quiz. Perfect for learning and teaching basic mathematics.',
}

export default function MultiplicationTablePage() {
  return (
    <ToolLayout
      title="Multiplication Table Generator"
      description="Generate customizable multiplication tables with practice mode and quiz. Perfect for learning and teaching basic mathematics."
    >
      <MultiplicationTable />
    </ToolLayout>
  )
} 