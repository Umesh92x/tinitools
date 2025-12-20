import ToolLayout from '@/components/layout/ToolLayout'
import { ImageToBase64 } from '@/components/tools/image/ImageToBase64'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Image to Base64 Converter',
  description: 'Convert images to base64 string format. Support for PNG, JPG, GIF, and more. Perfect for embedding images in CSS or HTML.',
  keywords: ['image to base64', 'base64 encoder', 'image encoder', 'data URI', 'image converter'],
})

export default function ImageToBase64Page() {
  return (
    <ToolLayout
      title="Image to Base64 Converter"
      description="Convert images to base64 string format. Support for PNG, JPG, GIF, and more."
    >
      <ImageToBase64 />
    </ToolLayout>
  )
} 