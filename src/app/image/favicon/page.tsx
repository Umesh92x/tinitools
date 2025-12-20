import ToolLayout from '@/components/layout/ToolLayout'
import { FaviconGenerator } from '@/components/tools/image/FaviconGenerator'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Favicon Generator',
  description: 'Generate favicons from images in multiple sizes. Perfect for websites and web apps.',
  keywords: ['favicon generator', 'favicon maker', 'icon generator', 'website icon', 'app icon'],
})

export default function FaviconGeneratorPage() {
  return (
    <ToolLayout
      title="Favicon Generator"
      description="Generate favicons from images in multiple sizes. Perfect for websites and web apps."
    >
      <FaviconGenerator />
    </ToolLayout>
  )
} 