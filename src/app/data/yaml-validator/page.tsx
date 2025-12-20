import ToolLayout from '@/components/layout/ToolLayout'
import { YamlValidator } from '@/components/tools/data/YamlValidator'

export const metadata = {
  title: 'YAML Validator - TiniTools',
  description: 'Validate YAML syntax and structure online. Get detailed error reporting and view parsed data structure.',
}

export default function YamlValidatorPage() {
  return (
    <ToolLayout
      title="YAML Validator"
      description="Validate your YAML documents and view the parsed data structure. Get detailed error reporting for invalid YAML."
    >
      <YamlValidator />
    </ToolLayout>
  )
} 