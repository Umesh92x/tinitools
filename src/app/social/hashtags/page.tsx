import ToolLayout from '@/components/layout/ToolLayout'
import { HashtagGenerator } from '@/components/tools/social/HashtagGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Hashtag Generator',
  description: 'Free hashtag generator - Generate relevant hashtags for your social media posts instantly. Boost your content visibility and reach. No signup required.',
  path: '/social/hashtags',
  keywords: ['hashtag generator', 'instagram hashtags', 'social media hashtags', 'hashtag suggestions', 'trending hashtags'],
})

export default function HashtagGeneratorPage() {
  const relatedTools = [
    { name: 'Caption Generator', href: '/social/caption' },
    { name: 'Bio Generator', href: '/social/bio-generator' },
    { name: 'Username Generator', href: '/social/username-generator' },
    { name: 'Link Shortener', href: '/social/link-shortener' },
  ]

  return (
    <ToolLayout
      title="Hashtag Generator"
      description="Free hashtag generator - Generate relevant hashtags for your social media posts instantly. Boost your content visibility and reach. No signup required."
      category="social"
      categoryName="Social Media Tools"
      relatedTools={relatedTools}
    >
      <HashtagGenerator />
    </ToolLayout>
  )
} 