import ToolLayout from '@/components/layout/ToolLayout'
import { CsvToJsonConverter } from '@/components/tools/data/CsvToJsonConverter'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'CSV to JSON Converter',
  description: 'Free CSV to JSON converter - Convert CSV files to JSON format online instantly. Support for custom delimiters and data types. No signup required.',
  path: '/data/csv-to-json',
  keywords: ['csv to json', 'csv converter', 'json converter', 'csv parser', 'data converter'],
})

export default function CsvToJsonPage() {
  const relatedTools = [
    { name: 'JSON to CSV Converter', href: '/data/json-to-csv' },
    { name: 'JSON Formatter', href: '/data/json-formatter' },
    { name: 'XML Formatter', href: '/data/xml-formatter' },
    { name: 'Base64 Encoder', href: '/data/base64' },
  ]

  return (
    <ToolLayout
      title="CSV to JSON Converter"
      description="Free CSV to JSON converter - Convert CSV files to JSON format online instantly. Support for custom delimiters and data types. No signup required."
      category="data"
      categoryName="Data Tools"
      relatedTools={relatedTools}
    >
      <CsvToJsonConverter />
    </ToolLayout>
  )
} 