import { Metadata } from 'next';
import HtmlEntityConverter from '@/components/tools/dev/HtmlEntityConverter';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'HTML Entity Encoder/Decoder - Free Online HTML Tools',
  description: 'Free online HTML entity encoder and decoder. Convert special characters to HTML entities and vice versa. Supports named entities and numeric codes.',
  keywords: 'html entity encoder, html entity decoder, html special characters, html character codes, html entities converter',
};

export default function HtmlEntitiesPage() {
  return (
    <ToolLayout
      title="HTML Entity Encoder/Decoder"
      description="Convert special characters to HTML entities and vice versa. Supports named entities and numeric codes."
    >
      <HtmlEntityConverter />
    </ToolLayout>
  );
} 