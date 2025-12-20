import ToolLayout from '@/components/layout/ToolLayout'
import { XmlFormatter } from '@/components/tools/data/XmlFormatter'

export const metadata = {
  title: 'XML Formatter - TiniTools',
  description: 'Format and prettify XML documents online. Customizable indentation and validation.',
}

export default function XmlFormatterPage() {
  return (
    <ToolLayout
      title="XML Formatter"
      description="Format and validate your XML documents. Customize indentation and get instant validation feedback."
    >
      <XmlFormatter />
    </ToolLayout>
  )
} 