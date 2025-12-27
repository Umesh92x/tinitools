import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import JsonFormatter from '@/components/tools/dev/JsonFormatter';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = generateMetadata({
  title: 'JSON Formatter & Validator',
  description: 'Free online JSON formatter and validator - Format, validate, and beautify your JSON data instantly. Supports minification and pretty printing. No signup required.',
  path: '/dev/json',
  keywords: ['json formatter', 'json validator', 'json beautifier', 'json pretty print', 'json minifier', 'online json tools'],
});

export default function JsonFormatterPage() {
  const relatedTools = [
    { name: 'HTML Entity Converter', href: '/dev/html-entities' },
    { name: 'RegEx Tester', href: '/dev/regex' },
    { name: 'JWT Decoder', href: '/dev/jwt' },
    { name: 'UUID Generator', href: '/dev/uuid' },
  ]

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Free online JSON formatter and validator - Format, validate, and beautify your JSON data instantly. Supports minification and pretty printing. No signup required."
      category="dev"
      categoryName="Developer Tools"
      relatedTools={relatedTools}
    >
      <JsonFormatter />
    </ToolLayout>
  );
} 