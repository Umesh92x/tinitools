import { FileJson, FileSpreadsheet, FileCode, FileCheck } from 'lucide-react'
import CategoryLayout from '@/components/layout/CategoryLayout'

export const metadata = {
  title: 'Data Tools - TiniTools',
  description: 'Free online tools for data conversion, formatting, and validation. Convert between CSV, JSON, XML, and YAML formats.',
}

const tools = [
  {
    name: 'CSV to JSON Converter',
    description: 'Convert CSV files to JSON format with support for custom delimiters and data types.',
    href: '/data/csv-to-json',
    icon: FileSpreadsheet,
  },
  {
    name: 'JSON to CSV Converter',
    description: 'Convert JSON data to CSV format with customizable field mapping and nested object handling.',
    href: '/data/json-to-csv',
    icon: FileJson,
  },
  {
    name: 'XML Formatter',
    description: 'Format and prettify XML documents with customizable indentation and validation.',
    href: '/data/xml-formatter',
    icon: FileCode,
  },
  {
    name: 'YAML Validator',
    description: 'Validate YAML syntax and structure with detailed error reporting.',
    href: '/data/yaml-validator',
    icon: FileCheck,
  },
]

export default function DataToolsPage() {
  return (
    <CategoryLayout
      title="Data Tools"
      description="A collection of free online tools for working with different data formats. Convert, format, and validate your data easily."
      tools={tools}
    />
  )
} 