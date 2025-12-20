import ToolLayout from '@/components/layout/ToolLayout'
import { PasswordGenerator } from '@/components/tools/text/PasswordGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Password Generator',
  description: 'Generate secure passwords with customizable options for length, characters, and complexity.',
  keywords: ['password generator', 'secure password', 'random password', 'strong password', 'password creator'],
})

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      title="Password Generator"
      description="Generate secure passwords with customizable options for length, characters, and complexity."
    >
      <PasswordGenerator />
    </ToolLayout>
  )
} 