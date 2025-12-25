import ToolLayout from '@/components/layout/ToolLayout'
import { UsernameGenerator } from '@/components/tools/social/UsernameGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Username Generator',
  description: 'Generate unique usernames for social media accounts. Create professional, creative, or gaming-style usernames.',
  keywords: ['username generator', 'social media username', 'username creator', 'unique username', 'username ideas'],
})

export default function UsernameGeneratorPage() {
  return (
    <ToolLayout
      title="Username Generator"
      description="Generate unique usernames for social media accounts. Create professional, creative, or gaming-style usernames."
    >
      <UsernameGenerator />
    </ToolLayout>
  )
}

