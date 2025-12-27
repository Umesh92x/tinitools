import ToolLayout from '@/components/layout/ToolLayout'
import { UsernameGenerator } from '@/components/tools/social/UsernameGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Username Generator',
  description: 'Free username generator - Generate unique usernames for social media accounts instantly. Create professional, creative, or gaming-style usernames. No signup required.',
  path: '/social/username-generator',
  keywords: ['username generator', 'social media username', 'username creator', 'unique username', 'username ideas'],
})

export default function UsernameGeneratorPage() {
  const relatedTools = [
    { name: 'Bio Generator', href: '/social/bio-generator' },
    { name: 'Hashtag Generator', href: '/social/hashtags' },
    { name: 'Caption Generator', href: '/social/caption' },
    { name: 'Link Shortener', href: '/social/link-shortener' },
  ]

  return (
    <ToolLayout
      title="Username Generator"
      description="Free username generator - Generate unique usernames for social media accounts instantly. Create professional, creative, or gaming-style usernames. No signup required."
      category="social"
      categoryName="Social Media Tools"
      relatedTools={relatedTools}
    >
      <UsernameGenerator />
    </ToolLayout>
  )
}

