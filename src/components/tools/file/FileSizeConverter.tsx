'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';

const units: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB'];

const convertSize = (value: number, fromUnit: Unit, toUnit: Unit): number => {
  const unitToBytes = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  const bytes = value * unitToBytes[fromUnit];
  return bytes / unitToBytes[toUnit];
};

export default function FileSizeConverter() {
  const [value, setValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<Unit>('MB');
  const [toUnit, setToUnit] = useState<Unit>('GB');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    if (value && !isNaN(Number(value))) {
      const converted = convertSize(Number(value), fromUnit, toUnit);
      setResult(converted);
    } else {
      setResult(null);
    }
  }, [value, fromUnit, toUnit]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Value</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter size..."
              min="0"
              step="any"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From</Label>
              <Select value={fromUnit} onValueChange={(value: Unit) => setFromUnit(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>To</Label>
              <Select value={toUnit} onValueChange={(value: Unit) => setToUnit(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {result !== null && (
        <Card className="p-6">
          <div className="text-center">
            <p className="text-lg font-medium">
              {value} {fromUnit} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toUnit}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
} 