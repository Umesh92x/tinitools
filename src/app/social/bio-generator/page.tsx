import ToolLayout from '@/components/layout/ToolLayout'
import { BioGenerator } from '@/components/tools/social/BioGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Bio Generator',
  description: 'Create engaging social media bios and descriptions for Instagram, Twitter, LinkedIn, and more.',
  keywords: ['bio generator', 'social media bio', 'instagram bio', 'twitter bio', 'linkedin bio', 'profile bio'],
})

export default function BioGeneratorPage() {
  return (
    <ToolLayout
      title="Bio Generator"
      description="Create engaging social media bios and descriptions for Instagram, Twitter, LinkedIn, and more."
    >
      <BioGenerator />
    </ToolLayout>
  )
}

