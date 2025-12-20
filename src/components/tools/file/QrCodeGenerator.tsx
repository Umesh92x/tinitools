'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { DownloadIcon } from 'lucide-react';
import QRCode from 'qrcode';

type QRType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi';

interface QROptions {
  width: number;
  margin: number;
  color: {
    dark: string;
    light: string;
  };
}

export default function QrCodeGenerator() {
  const [type, setType] = useState<QRType>('text');
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [options, setOptions] = useState<QROptions>({
    width: 300,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });

  const generateQRCode = async () => {
    if (!text) {
      toast.error('Please enter some text');
      return;
    }

    let qrText = text;
    switch (type) {
      case 'url':
        if (!text.startsWith('http://') && !text.startsWith('https://')) {
          qrText = `https://${text}`;
        }
        break;
      case 'email':
        qrText = `mailto:${text}`;
        break;
      case 'phone':
        qrText = `tel:${text}`;
        break;
      case 'sms':
        qrText = `sms:${text}`;
        break;
      case 'wifi':
        qrText = `WIFI:T:WPA;S:${text};P:${text};;`;
        break;
    }

    try {
      const dataUrl = await QRCode.toDataURL(qrText, options);
      setQrDataUrl(dataUrl);
    } catch (error) {
      toast.error('Error generating QR code');
    }
  };

  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded');
  };

  useEffect(() => {
    if (text) {
      generateQRCode();
    }
  }, [text, type, options]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>QR Code Type</Label>
            <Select value={type} onValueChange={(value: QRType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="wifi">WiFi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>
              {type === 'text' && 'Text'}
              {type === 'url' && 'URL'}
              {type === 'email' && 'Email Address'}
              {type === 'phone' && 'Phone Number'}
              {type === 'sms' && 'Phone Number'}
              {type === 'wifi' && 'Network Name'}
            </Label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Enter ${type}...`}
            />
          </div>

          <div>
            <Label>QR Code Color</Label>
            <Input
              type="color"
              value={options.color.dark}
              onChange={(e) =>
                setOptions({
                  ...options,
                  color: { ...options.color, dark: e.target.value },
                })
              }
              className="h-10 w-20"
            />
          </div>
        </div>
      </Card>

      {qrDataUrl && (
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <img src={qrDataUrl} alt="QR Code" className="max-w-full" />
            <Button onClick={downloadQRCode}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
} 