import ToolLayout from '@/components/layout/ToolLayout'
import { CsvToJsonConverter } from '@/components/tools/data/CsvToJsonConverter'

export const metadata = {
  title: 'CSV to JSON Converter - TiniTools',
  description: 'Convert CSV files to JSON format online. Support for custom delimiters and data types.',
}

export default function CsvToJsonPage() {
  return (
    <ToolLayout
      title="CSV to JSON Converter"
      description="Convert your CSV data to JSON format. Supports custom delimiters and header row options."
    >
      <CsvToJsonConverter />
    </ToolLayout>
  )
} 