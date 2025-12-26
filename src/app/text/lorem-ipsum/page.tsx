import ToolLayout from '@/components/layout/ToolLayout'
import { LoremIpsumGenerator } from '@/components/tools/text/LoremIpsumGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Lorem Ipsum Generator',
  description: 'Free Lorem Ipsum generator - Generate placeholder text instantly. Customize length and format. Used by 50,000+ designers daily.',
  path: '/text/lorem-ipsum',
  keywords: ['lorem ipsum', 'placeholder text', 'dummy text', 'text generator'],
})

export default function LoremIpsumPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Password Generator', href: '/text/password' },
    { name: 'Text Statistics', href: '/text/statistics' },
    { name: 'Text to Speech', href: '/text/text-to-speech' },
  ]

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Free Lorem Ipsum generator - Generate placeholder text instantly. Customize length and format. Used by 50,000+ designers daily."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <LoremIpsumGenerator />
    </ToolLayout>
  )
} 