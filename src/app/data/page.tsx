import { FileJson, FileSpreadsheet, FileCode, FileCheck, Code, Lock } from 'lucide-react'
import CategoryLayout from '@/components/layout/CategoryLayout'

export const metadata = {
  title: 'Data Tools - TiniTools',
  description: 'Free online tools for data conversion, formatting, and validation. Convert between CSV, JSON, XML, YAML, and Base64 formats.',
}

const tools = [
  {
    name: 'CSV to JSON Converter',
    description: 'Convert CSV files to JSON format with support for custom delimiters, auto-convert, and file upload.',
    href: '/data/csv-to-json',
    icon: FileSpreadsheet,
  },
  {
    name: 'JSON to CSV Converter',
    description: 'Convert JSON data to CSV format with customizable field mapping, auto-convert, and file upload.',
    href: '/data/json-to-csv',
    icon: FileJson,
  },
  {
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and minify JSON data with real-time validation and file support.',
    href: '/data/json-formatter',
    icon: Code,
  },
  {
    name: 'XML Formatter',
    description: 'Format, minify, and validate XML documents with customizable indentation and file upload.',
    href: '/data/xml-formatter',
    icon: FileCode,
  },
  {
    name: 'YAML Validator',
    description: 'Validate YAML syntax, format YAML, and convert to JSON with detailed error reporting.',
    href: '/data/yaml-validator',
    icon: FileCheck,
  },
  {
    name: 'Base64 Encoder & Decoder',
    description: 'Encode text to Base64 or decode Base64 strings with file support and copy/download options.',
    href: '/data/base64',
    icon: Lock,
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