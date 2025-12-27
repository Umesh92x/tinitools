import ToolLayout from '@/components/layout/ToolLayout'
import { CaptionGenerator } from '@/components/tools/social/CaptionGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Social Media Caption Generator',
  description: 'Free caption generator - Generate engaging captions for your social media posts instantly. Perfect for Instagram, Facebook, Twitter, and LinkedIn. No signup required.',
  path: '/social/caption',
  keywords: ['caption generator', 'social media captions', 'instagram captions', 'post captions', 'content creation'],
})

export default function CaptionGeneratorPage() {
  const relatedTools = [
    { name: 'Hashtag Generator', href: '/social/hashtags' },
    { name: 'Bio Generator', href: '/social/bio-generator' },
    { name: 'Share Generator', href: '/social/share-generator' },
    { name: 'Username Generator', href: '/social/username-generator' },
  ]

  return (
    <ToolLayout
      title="Social Media Caption Generator"
      description="Free caption generator - Generate engaging captions for your social media posts instantly. Perfect for Instagram, Facebook, Twitter, and LinkedIn. No signup required."
      category="social"
      categoryName="Social Media Tools"
      relatedTools={relatedTools}
    >
      <CaptionGenerator />
    </ToolLayout>
  )
} 