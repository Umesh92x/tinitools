import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  ImageDown,
  FileCode2,
  Palette,
  Bookmark
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Image Tools',
  description: 'A collection of free online tools to help you work with images. Resize, convert, and generate favicons with ease.',
  path: '/image',
  keywords: ['image tools', 'image resizer', 'image converter', 'favicon generator', 'color picker'],
})

export default function ImageTools() {
const tools = [
  {
      title: 'Image Resizer',
    description: 'Resize and compress images while maintaining quality. Support for multiple formats.',
    href: '/image/resizer',
      icon: ImageDown,
  },
  {
      title: 'Image to Base64',
    description: 'Convert images to base64 string format. Perfect for embedding images in CSS or HTML.',
    href: '/image/base64',
      icon: FileCode2,
  },
  {
      title: 'Color Picker',
    description: 'Pick colors from images, use color wheel, and get color codes in HEX, RGB, and HSL formats.',
    href: '/image/color-picker',
      icon: Palette,
  },
  {
      title: 'Favicon Generator',
    description: 'Generate favicons from images in multiple sizes. Perfect for websites and web apps.',
    href: '/image/favicon',
      icon: Bookmark,
  },
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Image Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          A collection of free online tools to help you work with images. Resize, convert, and generate favicons with ease.
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 