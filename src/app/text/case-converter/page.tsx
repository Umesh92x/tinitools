import ToolLayout from '@/components/layout/ToolLayout'
import { CaseConverter } from '@/components/tools/text/CaseConverter'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Case Converter',
  description: 'Free online case converter - Transform text to uppercase, lowercase, title case instantly. No signup required. Used by 10,000+ users daily.',
  path: '/text/case-converter',
  keywords: ['case converter', 'text case', 'uppercase', 'lowercase', 'title case', 'text converter', 'case changer']
})

export default function CaseConverterPage() {
  const relatedTools = [
    { name: 'Line Break Remover', href: '/text/line-breaks' },
    { name: 'Text to Speech', href: '/text/text-to-speech' },
    { name: 'Password Generator', href: '/text/password' },
    { name: 'Text Statistics', href: '/text/statistics' },
  ]

  return (
    <ToolLayout
      title="Case Converter"
      description="Free online case converter - Transform text to uppercase, lowercase, title case instantly. No signup required. Used by 10,000+ users daily."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <CaseConverter />
    </ToolLayout>
  )
} 