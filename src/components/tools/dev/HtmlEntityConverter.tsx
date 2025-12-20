'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { CopyIcon } from 'lucide-react';

export default function HtmlEntityConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encodeHtml = () => {
    if (!input.trim()) {
      toast.error('Please enter some text to encode');
      return;
    }
    const encoded = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    setOutput(encoded);
    toast.success('Text encoded successfully');
  };

  const decodeHtml = () => {
    if (!input.trim()) {
      toast.error('Please enter some text to decode');
      return;
    }
    const decoded = input
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
      .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    setOutput(decoded);
    toast.success('Text decoded successfully');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter text to encode/decode..."
            className="min-h-[200px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={encodeHtml}>Encode HTML Entities</Button>
            <Button onClick={decodeHtml}>Decode HTML Entities</Button>
          </div>
        </div>
      </Card>

      {output && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <pre className="whitespace-pre-wrap break-all bg-secondary p-4 rounded-md overflow-x-auto">
              {output}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
} 