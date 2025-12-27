import { Metadata } from 'next'
import ToolLayout from '@/components/layout/ToolLayout'
import { Base64Converter } from '@/components/tools/data/Base64Converter'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Base64 Encoder & Decoder',
  description: 'Free Base64 encoder - Encode text to Base64 or decode Base64 strings instantly. Supports file encoding and decoding with copy and download options. No signup required.',
  path: '/data/base64',
  keywords: ['base64 encoder', 'base64 decoder', 'base64 converter', 'base64 encode', 'base64 decode'],
})

export default function Base64ConverterPage() {
  const relatedTools = [
    { name: 'JSON Formatter', href: '/data/json-formatter' },
    { name: 'CSV to JSON Converter', href: '/data/csv-to-json' },
    { name: 'XML Formatter', href: '/data/xml-formatter' },
    { name: 'YAML Validator', href: '/data/yaml-validator' },
  ]

  return (
    <ToolLayout
      title="Base64 Encoder & Decoder"
      description="Free Base64 encoder - Encode text to Base64 or decode Base64 strings instantly. Supports file encoding and decoding with copy and download options. No signup required."
      category="data"
      categoryName="Data Tools"
      relatedTools={relatedTools}
    >
      <Base64Converter />
    </ToolLayout>
  )
}

