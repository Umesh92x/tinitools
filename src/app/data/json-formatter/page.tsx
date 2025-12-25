import { Metadata } from 'next'
import ToolLayout from '@/components/layout/ToolLayout'
import { JsonFormatter } from '@/components/tools/data/JsonFormatter'

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - TiniTools',
  description: 'Format, validate, and minify JSON data. Beautify JSON with customizable indentation or compress it for production use.',
}

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, and minify JSON data. Beautify JSON with customizable indentation or compress it for production use."
    >
      <JsonFormatter />
    </ToolLayout>
  )
}

