import ToolLayout from '@/components/layout/ToolLayout'
import { ColorPicker } from '@/components/tools/image/ColorPicker'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Color Picker',
  description: 'Free color picker tool - Pick colors from images, use color wheel, get HEX, RGB, HSL codes instantly. No signup required.',
  path: '/image/color-picker',
  keywords: ['color picker', 'color wheel', 'color codes', 'hex color', 'rgb color', 'hsl color'],
})

export default function ColorPickerPage() {
  const relatedTools = [
    { name: 'Image Resizer', href: '/image/resizer' },
    { name: 'Image to Base64', href: '/image/base64' },
    { name: 'Favicon Generator', href: '/image/favicon' },
  ]

  return (
    <ToolLayout
      title="Color Picker"
      description="Free color picker tool - Pick colors from images, use color wheel, get HEX, RGB, HSL codes instantly. No signup required."
      category="image"
      categoryName="Image Tools"
      relatedTools={relatedTools}
    >
      <ColorPicker />
    </ToolLayout>
  )
} 