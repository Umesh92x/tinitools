import ToolLayout from '@/components/layout/ToolLayout'
import { HashtagGenerator } from '@/components/tools/social/HashtagGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Hashtag Generator',
  description: 'Generate relevant hashtags for your social media posts. Boost your content visibility and reach.',
  keywords: ['hashtag generator', 'instagram hashtags', 'social media hashtags', 'hashtag suggestions', 'trending hashtags'],
})

export default function HashtagGeneratorPage() {
  return (
    <ToolLayout
      title="Hashtag Generator"
      description="Generate relevant hashtags for your social media posts. Boost your content visibility and reach."
    >
      <HashtagGenerator />
    </ToolLayout>
  )
} 