import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import JwtDecoder from '@/components/tools/dev/JwtDecoder';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = generateMetadata({
  title: 'JWT Decoder',
  description: 'Free online JWT decoder and validator - Decode and verify JSON Web Tokens (JWT) instantly. View header, payload, and signature in a readable format. No signup required.',
  path: '/dev/jwt',
  keywords: ['jwt decoder', 'jwt validator', 'json web token', 'jwt parser', 'jwt tool', 'decode jwt'],
});

export default function JwtDecoderPage() {
  const relatedTools = [
    { name: 'JSON Formatter', href: '/dev/json' },
    { name: 'RegEx Tester', href: '/dev/regex' },
    { name: 'UUID Generator', href: '/dev/uuid' },
    { name: 'HTML Entity Converter', href: '/dev/html-entities' },
  ]

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Free online JWT decoder and validator - Decode and verify JSON Web Tokens (JWT) instantly. View header, payload, and signature in a readable format. No signup required."
      category="dev"
      categoryName="Developer Tools"
      relatedTools={relatedTools}
    >
      <JwtDecoder />
    </ToolLayout>
  );
} 