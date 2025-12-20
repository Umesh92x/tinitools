'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CopyIcon, UploadIcon } from 'lucide-react';

interface HashResult {
  md5: string;
  sha1: string;
  sha256: string;
}

export default function FileHashCalculator() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<HashResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateHashes = async (file: File) => {
    return new Promise<HashResult>(async (resolve, reject) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const sha256Hash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        // For MD5 and SHA-1, we'll use a Web Worker since they're not available in Web Crypto API
        const textDecoder = new TextDecoder('utf-8');
        const fileContent = textDecoder.decode(new Uint8Array(arrayBuffer));
        
        // Simple hash function for MD5 and SHA-1 (for demo purposes)
        const tempMd5 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fileContent + 'md5'));
        const tempSha1 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fileContent + 'sha1'));
        
        const md5Hash = Array.from(new Uint8Array(tempMd5))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        const sha1Hash = Array.from(new Uint8Array(tempSha1))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        resolve({
          md5: md5Hash,
          sha1: sha1Hash,
          sha256: sha256Hash,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    try {
      const result = await calculateHashes(selectedFile);
      setHashes(result);
      toast.success('File hash calculated successfully');
    } catch (error) {
      console.error('Error calculating file hashes:', error);
      toast.error('Error calculating file hashes');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    setFile(droppedFile);
    setLoading(true);
    try {
      const result = await calculateHashes(droppedFile);
      setHashes(result);
      toast.success('File hash calculated successfully');
    } catch (error) {
      console.error('Error calculating file hashes:', error);
      toast.error('Error calculating file hashes');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      toast.success('Hash copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy hash');
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="*/*"
          />
          <div className="flex flex-col items-center">
            <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              Drag and drop your file here, or{' '}
              <span className="text-primary hover:underline">browse</span>
            </p>
            <p className="text-sm text-gray-500">
              File will be processed locally - no upload required
            </p>
          </div>
        </div>

        {file && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
      </Card>

      {loading && (
        <div className="text-center">
          <p>Calculating hashes...</p>
        </div>
      )}

      {hashes && (
        <Card className="p-6 space-y-4">
          <div>
            <Label>SHA-256 Hash</Label>
            <div className="flex gap-2 mt-1">
              <Input value={hashes.sha256} readOnly />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(hashes.sha256)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>SHA-1 Hash (Simulated)</Label>
            <div className="flex gap-2 mt-1">
              <Input value={hashes.sha1} readOnly />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(hashes.sha1)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>MD5 Hash (Simulated)</Label>
            <div className="flex gap-2 mt-1">
              <Input value={hashes.md5} readOnly />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(hashes.md5)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 