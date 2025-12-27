import ToolLayout from '@/components/layout/ToolLayout'
import { LinkShortener } from '@/components/tools/social/LinkShortener'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Link Shortener',
  description: 'Free link shortener - Shorten long URLs for social media sharing instantly. Create custom short links with optional custom aliases. No signup required.',
  path: '/social/link-shortener',
  keywords: ['url shortener', 'link shortener', 'short url', 'url shortener tool', 'custom url'],
})

export default function LinkShortenerPage() {
  const relatedTools = [
    { name: 'QR Code Generator', href: '/social/qr-code' },
    { name: 'Share Generator', href: '/social/share-generator' },
    { name: 'Hashtag Generator', href: '/social/hashtags' },
    { name: 'Caption Generator', href: '/social/caption' },
  ]

  return (
    <ToolLayout
      title="Link Shortener"
      description="Free link shortener - Shorten long URLs for social media sharing instantly. Create custom short links with optional custom aliases. No signup required."
      category="social"
      categoryName="Social Media Tools"
      relatedTools={relatedTools}
    >
      <LinkShortener />
    </ToolLayout>
  )
}

