import ToolLayout from '@/components/layout/ToolLayout'
import { JsonToCsvConverter } from '@/components/tools/data/JsonToCsvConverter'

export const metadata = {
  title: 'JSON to CSV Converter - TiniTools',
  description: 'Convert JSON arrays to CSV format online. Support for nested objects and custom delimiters.',
}

export default function JsonToCsvPage() {
  return (
    <ToolLayout
      title="JSON to CSV Converter"
      description="Convert your JSON arrays to CSV format. Supports nested objects and custom delimiters."
    >
      <JsonToCsvConverter />
    </ToolLayout>
  )
} 