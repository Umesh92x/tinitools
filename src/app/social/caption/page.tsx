import ToolLayout from '@/components/layout/ToolLayout'
import { CaptionGenerator } from '@/components/tools/social/CaptionGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Social Media Caption Generator',
  description: 'Generate engaging captions for your social media posts. Perfect for Instagram, Facebook, Twitter, and LinkedIn.',
  keywords: ['caption generator', 'social media captions', 'instagram captions', 'post captions', 'content creation'],
})

export default function CaptionGeneratorPage() {
  return (
    <ToolLayout
      title="Social Media Caption Generator"
      description="Generate engaging captions for your social media posts. Perfect for Instagram, Facebook, Twitter, and LinkedIn."
    >
      <CaptionGenerator />
    </ToolLayout>
  )
} 