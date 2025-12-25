import { Metadata } from 'next'
import ToolLayout from '@/components/layout/ToolLayout'
import { Base64Converter } from '@/components/tools/data/Base64Converter'

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder - TiniTools',
  description: 'Encode text to Base64 or decode Base64 strings. Supports file encoding and decoding with copy and download options.',
}

export default function Base64ConverterPage() {
  return (
    <ToolLayout
      title="Base64 Encoder & Decoder"
      description="Encode text to Base64 or decode Base64 strings. Supports file encoding and decoding with copy and download options."
    >
      <Base64Converter />
    </ToolLayout>
  )
}

