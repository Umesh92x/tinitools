import ToolLayout from '@/components/layout/ToolLayout'
import { JsonToCsvConverter } from '@/components/tools/data/JsonToCsvConverter'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'JSON to CSV Converter',
  description: 'Free JSON to CSV converter - Convert JSON arrays to CSV format online instantly. Support for nested objects and custom delimiters. No signup required.',
  path: '/data/json-to-csv',
  keywords: ['json to csv', 'json converter', 'csv converter', 'json parser', 'data converter'],
})

export default function JsonToCsvPage() {
  const relatedTools = [
    { name: 'CSV to JSON Converter', href: '/data/csv-to-json' },
    { name: 'JSON Formatter', href: '/data/json-formatter' },
    { name: 'XML Formatter', href: '/data/xml-formatter' },
    { name: 'YAML Validator', href: '/data/yaml-validator' },
  ]

  return (
    <ToolLayout
      title="JSON to CSV Converter"
      description="Free JSON to CSV converter - Convert JSON arrays to CSV format online instantly. Support for nested objects and custom delimiters. No signup required."
      category="data"
      categoryName="Data Tools"
      relatedTools={relatedTools}
    >
      <JsonToCsvConverter />
    </ToolLayout>
  )
} 