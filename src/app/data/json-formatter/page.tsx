import { Metadata } from 'next'
import ToolLayout from '@/components/layout/ToolLayout'
import { JsonFormatter } from '@/components/tools/data/JsonFormatter'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'JSON Formatter & Validator',
  description: 'Free JSON formatter - Format, validate, and minify JSON data instantly. Beautify JSON with customizable indentation or compress it for production use. No signup required.',
  path: '/data/json-formatter',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json minifier', 'json prettifier'],
})

export default function JsonFormatterPage() {
  const relatedTools = [
    { name: 'JSON Formatter (Dev)', href: '/dev/json' },
    { name: 'CSV to JSON Converter', href: '/data/csv-to-json' },
    { name: 'XML Formatter', href: '/data/xml-formatter' },
    { name: 'YAML Validator', href: '/data/yaml-validator' },
  ]

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Free JSON formatter - Format, validate, and minify JSON data instantly. Beautify JSON with customizable indentation or compress it for production use. No signup required."
      category="data"
      categoryName="Data Tools"
      relatedTools={relatedTools}
    >
      <JsonFormatter />
    </ToolLayout>
  )
}

