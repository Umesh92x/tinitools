import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import HtmlEntityConverter from '@/components/tools/dev/HtmlEntityConverter';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = generateMetadata({
  title: 'HTML Entity Encoder/Decoder',
  description: 'Free online HTML entity encoder and decoder - Convert special characters to HTML entities and vice versa instantly. Supports named entities and numeric codes. No signup required.',
  path: '/dev/html-entities',
  keywords: ['html entity encoder', 'html entity decoder', 'html special characters', 'html character codes', 'html entities converter'],
});

export default function HtmlEntitiesPage() {
  const relatedTools = [
    { name: 'JSON Formatter', href: '/dev/json' },
    { name: 'RegEx Tester', href: '/dev/regex' },
    { name: 'JWT Decoder', href: '/dev/jwt' },
    { name: 'UUID Generator', href: '/dev/uuid' },
  ]

  return (
    <ToolLayout
      title="HTML Entity Encoder/Decoder"
      description="Free online HTML entity encoder and decoder - Convert special characters to HTML entities and vice versa instantly. Supports named entities and numeric codes. No signup required."
      category="dev"
      categoryName="Developer Tools"
      relatedTools={relatedTools}
    >
      <HtmlEntityConverter />
    </ToolLayout>
  );
} 