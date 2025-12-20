import ToolLayout from '@/components/layout/ToolLayout'
import { LoremIpsumGenerator } from '@/components/tools/text/LoremIpsumGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Lorem Ipsum Generator',
  description: 'Generate Lorem Ipsum placeholder text. Customize length and format.',
  keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'text generator'],
})

export default function LoremIpsumPage() {
  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate Lorem Ipsum placeholder text. Customize length and format."
    >
      <LoremIpsumGenerator />
    </ToolLayout>
  )
} 