import ToolLayout from '@/components/layout/ToolLayout'
import { YamlValidator } from '@/components/tools/data/YamlValidator'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'YAML Validator',
  description: 'Free YAML validator - Validate YAML syntax and structure online instantly. Get detailed error reporting and view parsed data structure. No signup required.',
  path: '/data/yaml-validator',
  keywords: ['yaml validator', 'yaml parser', 'yaml checker', 'yaml formatter', 'yaml syntax'],
})

export default function YamlValidatorPage() {
  const relatedTools = [
    { name: 'JSON Formatter', href: '/data/json-formatter' },
    { name: 'XML Formatter', href: '/data/xml-formatter' },
    { name: 'CSV to JSON Converter', href: '/data/csv-to-json' },
    { name: 'Base64 Encoder', href: '/data/base64' },
  ]

  return (
    <ToolLayout
      title="YAML Validator"
      description="Free YAML validator - Validate YAML syntax and structure online instantly. Get detailed error reporting and view parsed data structure. No signup required."
      category="data"
      categoryName="Data Tools"
      relatedTools={relatedTools}
    >
      <YamlValidator />
    </ToolLayout>
  )
} 