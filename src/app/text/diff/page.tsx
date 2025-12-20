import ToolLayout from '@/components/layout/ToolLayout'
import { TextDiffChecker } from '@/components/tools/text/TextDiffChecker'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Text Diff Checker',
  description: 'Compare two texts and highlight the differences. Perfect for finding changes between versions.',
  keywords: ['text diff', 'text compare', 'diff checker', 'text difference', 'text comparison'],
})

export default function TextDiffPage() {
  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two texts and highlight the differences. Perfect for finding changes between versions."
    >
      <TextDiffChecker />
    </ToolLayout>
  )
} 