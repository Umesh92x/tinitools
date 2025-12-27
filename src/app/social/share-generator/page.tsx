import ToolLayout from '@/components/layout/ToolLayout'
import { SocialShareGenerator } from '@/components/tools/social/SocialShareGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Social Share Generator',
  description: 'Free social share generator - Generate share links for Facebook, Twitter, LinkedIn, WhatsApp, and other social media platforms instantly. No signup required.',
  path: '/social/share-generator',
  keywords: ['social share generator', 'share buttons', 'social media links', 'share links', 'social sharing'],
})

export default function SocialShareGeneratorPage() {
  const relatedTools = [
    { name: 'Link Shortener', href: '/social/link-shortener' },
    { name: 'Hashtag Generator', href: '/social/hashtags' },
    { name: 'Caption Generator', href: '/social/caption' },
    { name: 'QR Code Generator', href: '/social/qr-code' },
  ]

  return (
    <ToolLayout
      title="Social Share Generator"
      description="Free social share generator - Generate share links for Facebook, Twitter, LinkedIn, WhatsApp, and other social media platforms instantly. No signup required."
      category="social"
      categoryName="Social Media Tools"
      relatedTools={relatedTools}
    >
      <SocialShareGenerator />
    </ToolLayout>
  )
}

