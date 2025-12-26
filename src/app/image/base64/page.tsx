import ToolLayout from '@/components/layout/ToolLayout'
import { ImageToBase64 } from '@/components/tools/image/ImageToBase64'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Image to Base64 Converter',
  description: 'Free image to base64 converter - Convert images to base64 string instantly. Support for PNG, JPG, GIF. Perfect for CSS/HTML embedding. No signup required.',
  path: '/image/base64',
  keywords: ['image to base64', 'base64 encoder', 'image encoder', 'data URI', 'image converter'],
})

export default function ImageToBase64Page() {
  const relatedTools = [
    { name: 'Image Resizer', href: '/image/resizer' },
    { name: 'Color Picker', href: '/image/color-picker' },
    { name: 'Favicon Generator', href: '/image/favicon' },
  ]

  return (
    <ToolLayout
      title="Image to Base64 Converter"
      description="Free image to base64 converter - Convert images to base64 string instantly. Support for PNG, JPG, GIF. Perfect for CSS/HTML embedding. No signup required."
      category="image"
      categoryName="Image Tools"
      relatedTools={relatedTools}
    >
      <ImageToBase64 />
    </ToolLayout>
  )
} 