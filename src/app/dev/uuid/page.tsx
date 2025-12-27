import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import UuidGenerator from '@/components/tools/dev/UuidGenerator';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = generateMetadata({
  title: 'UUID Generator',
  description: 'Free online UUID generator - Generate Version 1 (timestamp) and Version 4 (random) UUIDs in various formats instantly. Perfect for developers and testing. No signup required.',
  path: '/dev/uuid',
  keywords: ['uuid generator', 'guid generator', 'uuid v4', 'uuid v1', 'unique identifier', 'uuid tool'],
});

export default function UuidGeneratorPage() {
  const relatedTools = [
    { name: 'JSON Formatter', href: '/dev/json' },
    { name: 'JWT Decoder', href: '/dev/jwt' },
    { name: 'RegEx Tester', href: '/dev/regex' },
    { name: 'Cron Generator', href: '/dev/cron' },
  ]

  return (
    <ToolLayout
      title="UUID Generator"
      description="Free online UUID generator - Generate Version 1 (timestamp) and Version 4 (random) UUIDs in various formats instantly. Perfect for developers and testing. No signup required."
      category="dev"
      categoryName="Developer Tools"
      relatedTools={relatedTools}
    >
      <UuidGenerator />
    </ToolLayout>
  );
} 