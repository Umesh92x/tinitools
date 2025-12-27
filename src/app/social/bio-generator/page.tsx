import ToolLayout from '@/components/layout/ToolLayout'
import { BioGenerator } from '@/components/tools/social/BioGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Bio Generator',
  description: 'Free bio generator - Create engaging social media bios and descriptions for Instagram, Twitter, LinkedIn, and more instantly. No signup required.',
  path: '/social/bio-generator',
  keywords: ['bio generator', 'social media bio', 'instagram bio', 'twitter bio', 'linkedin bio', 'profile bio'],
})

export default function BioGeneratorPage() {
  const relatedTools = [
    { name: 'Username Generator', href: '/social/username-generator' },
    { name: 'Caption Generator', href: '/social/caption' },
    { name: 'Hashtag Generator', href: '/social/hashtags' },
    { name: 'Share Generator', href: '/social/share-generator' },
  ]

  return (
    <ToolLayout
      title="Bio Generator"
      description="Free bio generator - Create engaging social media bios and descriptions for Instagram, Twitter, LinkedIn, and more instantly. No signup required."
      category="social"
      categoryName="Social Media Tools"
      relatedTools={relatedTools}
    >
      <BioGenerator />
    </ToolLayout>
  )
}

