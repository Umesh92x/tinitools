import ToolLayout from '@/components/layout/ToolLayout'
import { ImageResizer } from '@/components/tools/image/ImageResizer'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Image Resizer',
  description: 'Free online image resizer - Resize images instantly. Change dimensions, maintain aspect ratio, optimize file size. No signup required.',
  path: '/image/resizer',
  keywords: ['image resizer', 'resize image', 'image size', 'image dimensions', 'free image resizer'],
})

export default function ImageResizerPage() {
  const relatedTools = [
    { name: 'Image to Base64', href: '/image/base64' },
    { name: 'Color Picker', href: '/image/color-picker' },
    { name: 'Favicon Generator', href: '/image/favicon' },
  ]

  return (
    <ToolLayout
      title="Image Resizer"
      description="Free online image resizer - Resize images instantly. Change dimensions, maintain aspect ratio, optimize file size. No signup required."
      category="image"
      categoryName="Image Tools"
      relatedTools={relatedTools}
    >
      <ImageResizer />
    </ToolLayout>
  )
} 