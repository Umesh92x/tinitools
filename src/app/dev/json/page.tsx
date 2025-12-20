import { Metadata } from 'next';
import JsonFormatter from '@/components/tools/dev/JsonFormatter';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator - Free Online JSON Tools',
  description: 'Free online JSON formatter and validator. Format, validate, and beautify your JSON data with our easy-to-use tool. Supports minification and pretty printing.',
  keywords: 'json formatter, json validator, json beautifier, json pretty print, json minifier, online json tools',
};

export default function JsonFormatterPage() {
  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, and beautify your JSON data. Supports minification and pretty printing."
    >
      <JsonFormatter />
    </ToolLayout>
  );
} 