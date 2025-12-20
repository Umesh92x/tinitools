'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Printer, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function MultiplicationTable() {
  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(10);
  const [multiplier, setMultiplier] = useState(10);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    let content = 'Multiplication Table\n\n';
    for (let i = startNumber; i <= endNumber; i++) {
      content += `Table of ${i}:\n`;
      for (let j = 1; j <= multiplier; j++) {
        content += `${i} × ${j} = ${i * j}\n`;
      }
      content += '\n';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'multiplication-table.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Table downloaded successfully!');
  };

  const handleReset = () => {
    setStartNumber(1);
    setEndNumber(10);
    setMultiplier(10);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startNumber">Start Number</Label>
            <Input
              id="startNumber"
              type="number"
              min={1}
              max={100}
              value={startNumber}
              onChange={(e) => setStartNumber(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endNumber">End Number</Label>
            <Input
              id="endNumber"
              type="number"
              min={1}
              max={100}
              value={endNumber}
              onChange={(e) => setEndNumber(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiplier">Multiply Up To</Label>
            <Input
              id="multiplier"
              type="number"
              min={1}
              max={100}
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-3">
        {Array.from({ length: endNumber - startNumber + 1 }, (_, i) => startNumber + i).map(
          (num) => (
            <Card key={num} className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Table of {num}
              </h3>
              <div className="space-y-2">
                {Array.from({ length: multiplier }, (_, i) => i + 1).map((mult) => (
                  <div
                    key={mult}
                    className="flex justify-between items-center py-1 border-b last:border-0"
                  >
                    <span>
                      {num} × {mult}
                    </span>
                    <span className="font-semibold">{num * mult}</span>
                  </div>
                ))}
              </div>
            </Card>
          )
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container, .container * {
            visibility: visible;
          }
          .container {
            position: absolute;
            left: 0;
            top: 0;
          }
          button, input, label {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
} 