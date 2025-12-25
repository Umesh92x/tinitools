import ToolLayout from '@/components/layout/ToolLayout'
import { SocialShareGenerator } from '@/components/tools/social/SocialShareGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Social Share Generator',
  description: 'Generate share links for Facebook, Twitter, LinkedIn, WhatsApp, and other social media platforms.',
  keywords: ['social share generator', 'share buttons', 'social media links', 'share links', 'social sharing'],
})

export default function SocialShareGeneratorPage() {
  return (
    <ToolLayout
      title="Social Share Generator"
      description="Generate share links for Facebook, Twitter, LinkedIn, WhatsApp, and other social media platforms."
    >
      <SocialShareGenerator />
    </ToolLayout>
  )
}

