import ToolLayout from '@/components/layout/ToolLayout'
import { ImageResizer } from '@/components/tools/image/ImageResizer'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Image Resizer',
  description: 'Resize your images online for free. Change dimensions, maintain aspect ratio, and optimize file size.',
  keywords: ['image resizer', 'resize image', 'image size', 'image dimensions', 'free image resizer'],
})

export default function ImageResizerPage() {
  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize your images online for free. Change dimensions, maintain aspect ratio, and optimize file size."
    >
      <ImageResizer />
    </ToolLayout>
  )
} 