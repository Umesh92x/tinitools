import ToolLayout from '@/components/layout/ToolLayout'
import { CaseConverter } from '@/components/tools/text/CaseConverter'

export const metadata = {
  title: 'Case Converter - TiniTools',
  description: 'Convert text between different cases: uppercase, lowercase, title case, and more.',
}

export default function CaseConverterPage() {
  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between different cases: uppercase, lowercase, title case, and more."
    >
      <CaseConverter />
    </ToolLayout>
  )
} 