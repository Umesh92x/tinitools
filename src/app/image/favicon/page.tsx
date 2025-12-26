import ToolLayout from '@/components/layout/ToolLayout'
import { FaviconGenerator } from '@/components/tools/image/FaviconGenerator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Favicon Generator',
  description: 'Free favicon generator - Generate favicons from images in multiple sizes instantly. Perfect for websites and web apps. No signup required.',
  path: '/image/favicon',
  keywords: ['favicon generator', 'favicon maker', 'icon generator', 'website icon', 'app icon'],
})

export default function FaviconGeneratorPage() {
  const relatedTools = [
    { name: 'Image Resizer', href: '/image/resizer' },
    { name: 'Image to Base64', href: '/image/base64' },
    { name: 'Color Picker', href: '/image/color-picker' },
  ]

  return (
    <ToolLayout
      title="Favicon Generator"
      description="Free favicon generator - Generate favicons from images in multiple sizes instantly. Perfect for websites and web apps. No signup required."
      category="image"
      categoryName="Image Tools"
      relatedTools={relatedTools}
    >
      <FaviconGenerator />
    </ToolLayout>
  )
} 