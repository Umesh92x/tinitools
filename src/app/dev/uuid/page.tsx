import { Metadata } from 'next';
import UuidGenerator from '@/components/tools/dev/UuidGenerator';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'UUID Generator - Free Online UUID Tool',
  description: 'Free online UUID generator. Generate Version 1 (timestamp) and Version 4 (random) UUIDs in various formats. Perfect for developers and testing.',
  keywords: 'uuid generator, guid generator, uuid v4, uuid v1, unique identifier, uuid tool',
};

export default function UuidGeneratorPage() {
  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate Version 1 (timestamp) and Version 4 (random) UUIDs in various formats."
    >
      <UuidGenerator />
    </ToolLayout>
  );
} 