import { Metadata } from 'next';
import JwtDecoder from '@/components/tools/dev/JwtDecoder';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'JWT Decoder - Free Online JWT Token Tool',
  description: 'Free online JWT decoder and validator. Decode and verify JSON Web Tokens (JWT) instantly. View header, payload, and signature in a readable format.',
  keywords: 'jwt decoder, jwt validator, json web token, jwt parser, jwt tool, decode jwt',
};

export default function JwtDecoderPage() {
  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and verify JSON Web Tokens (JWT) instantly. View header, payload, and signature in a readable format."
    >
      <JwtDecoder />
    </ToolLayout>
  );
} 