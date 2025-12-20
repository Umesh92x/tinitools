'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CopyIcon, RefreshCwIcon } from 'lucide-react';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

type UuidVersion = 'v1' | 'v4';
type UuidFormat = 'standard' | 'uppercase' | 'no-hyphens';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [format, setFormat] = useState<UuidFormat>('standard');
  const [multipleUuids, setMultipleUuids] = useState(false);

  const generateUuid = () => {
    const uuid = version === 'v4' ? uuidv4() : uuidv1();
    let formattedUuid = uuid;

    switch (format) {
      case 'uppercase':
        formattedUuid = uuid.toUpperCase();
        break;
      case 'no-hyphens':
        formattedUuid = uuid.replace(/-/g, '');
        break;
    }

    return formattedUuid;
  };

  const generateUuids = () => {
    const count = multipleUuids ? 10 : 1;
    const newUuids = Array.from({ length: count }, generateUuid);
    setUuids(newUuids);
    toast.success(`Generated ${count} UUID${count > 1 ? 's' : ''}`);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      toast.success('All UUIDs copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy UUIDs');
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>UUID Version</Label>
            <RadioGroup
              value={version}
              onValueChange={(value: UuidVersion) => setVersion(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v4" id="v4" />
                <Label htmlFor="v4">Version 4 (Random)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v1" id="v1" />
                <Label htmlFor="v1">Version 1 (Timestamp)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value: UuidFormat) => setFormat(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="uppercase" id="uppercase" />
                <Label htmlFor="uppercase">Uppercase</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-hyphens" id="no-hyphens" />
                <Label htmlFor="no-hyphens">No Hyphens</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={multipleUuids}
              onCheckedChange={setMultipleUuids}
            />
            <Label>Generate Multiple UUIDs</Label>
          </div>

          <Button onClick={generateUuids} className="w-full">
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Generate UUID{multipleUuids ? 's' : ''}
          </Button>
        </div>
      </Card>

      {uuids.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Generated UUID{uuids.length > 1 ? 's' : ''}</h3>
              {uuids.length > 1 && (
                <Button size="sm" variant="outline" onClick={copyAllToClipboard}>
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-secondary rounded-md"
                >
                  <code className="font-mono">{uuid}</code>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(uuid)}>
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 