import { Metadata } from 'next';
import QrCodeGenerator from '@/components/tools/file/QrCodeGenerator';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'QR Code Generator - Create QR Codes Online',
  description: 'Free online QR code generator. Create QR codes for text, URLs, contact information, and more.',
  keywords: 'qr code generator, qr code maker, create qr code, qr code creator, qr code online',
};

export default function QrCodePage() {
  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create QR codes for text, URLs, contact information, and more."
    >
      <QrCodeGenerator />
    </ToolLayout>
  );
} 