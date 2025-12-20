import ToolLayout from '@/components/layout/ToolLayout'
import { ColorPicker } from '@/components/tools/image/ColorPicker'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Color Picker',
  description: 'Pick colors from images, use color wheel, and get color codes in HEX, RGB, and HSL formats.',
  keywords: ['color picker', 'color wheel', 'color codes', 'hex color', 'rgb color', 'hsl color'],
})

export default function ColorPickerPage() {
  return (
    <ToolLayout
      title="Color Picker"
      description="Pick colors from images, use color wheel, and get color codes in HEX, RGB, and HSL formats."
    >
      <ColorPicker />
    </ToolLayout>
  )
} 