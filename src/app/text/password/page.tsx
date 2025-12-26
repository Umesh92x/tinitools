import ToolLayout from '@/components/layout/ToolLayout'
import { PasswordGenerator } from '@/components/tools/text/PasswordGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Password Generator',
  description: 'Free secure password generator - Create strong, random passwords instantly. Customizable length and complexity. 100% free, no signup required.',
  path: '/text/password',
  keywords: ['password generator', 'secure password', 'random password', 'strong password', 'password creator'],
})

export default function PasswordGeneratorPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Text to Speech', href: '/text/text-to-speech' },
    { name: 'Text Statistics', href: '/text/statistics' },
    { name: 'Line Break Remover', href: '/text/line-breaks' },
  ]

  return (
    <ToolLayout
      title="Password Generator"
      description="Free secure password generator - Create strong, random passwords instantly. Customizable length and complexity. 100% free, no signup required."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <PasswordGenerator />
    </ToolLayout>
  )
} 