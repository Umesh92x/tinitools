import ToolLayout from '@/components/layout/ToolLayout'
import { XmlFormatter } from '@/components/tools/data/XmlFormatter'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'XML Formatter',
  description: 'Free XML formatter - Format and prettify XML documents online instantly. Customizable indentation and validation. No signup required.',
  path: '/data/xml-formatter',
  keywords: ['xml formatter', 'xml validator', 'xml beautifier', 'xml prettifier', 'xml parser'],
})

export default function XmlFormatterPage() {
  const relatedTools = [
    { name: 'JSON Formatter', href: '/data/json-formatter' },
    { name: 'YAML Validator', href: '/data/yaml-validator' },
    { name: 'CSV to JSON Converter', href: '/data/csv-to-json' },
    { name: 'Base64 Encoder', href: '/data/base64' },
  ]

  return (
    <ToolLayout
      title="XML Formatter"
      description="Free XML formatter - Format and prettify XML documents online instantly. Customizable indentation and validation. No signup required."
      category="data"
      categoryName="Data Tools"
      relatedTools={relatedTools}
    >
      <XmlFormatter />
    </ToolLayout>
  )
} 