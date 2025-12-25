import ToolLayout from '@/components/layout/ToolLayout'
import { LinkShortener } from '@/components/tools/social/LinkShortener'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Link Shortener',
  description: 'Shorten long URLs for social media sharing. Create custom short links with optional custom aliases.',
  keywords: ['url shortener', 'link shortener', 'short url', 'url shortener tool', 'custom url'],
})

export default function LinkShortenerPage() {
  return (
    <ToolLayout
      title="Link Shortener"
      description="Shorten long URLs for social media sharing. Create custom short links with optional custom aliases."
    >
      <LinkShortener />
    </ToolLayout>
  )
}

