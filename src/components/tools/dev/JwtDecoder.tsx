'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { CopyIcon } from 'lucide-react';

interface JwtParts {
  header: any;
  payload: any;
  signature: string;
}

const decodeBase64Url = (input: string) => {
  // Replace URL-safe chars and pad with '=' to make length a multiple of 4
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return atob(base64);
};

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [decodedToken, setDecodedToken] = useState<JwtParts | null>(null);
  const [error, setError] = useState('');

  const decodeToken = () => {
    try {
      if (!token.trim()) {
        toast.error('Please enter a JWT token');
        return;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Token must have three parts separated by dots.');
      }

      const decoded: JwtParts = {
        header: JSON.parse(decodeBase64Url(parts[0])),
        payload: JSON.parse(decodeBase64Url(parts[1])),
        signature: parts[2],
      };

      setDecodedToken(decoded);
      setError('');
      toast.success('Token decoded successfully');
    } catch (err) {
      setError((err as Error).message);
      setDecodedToken(null);
      toast.error('Failed to decode token');
    }
  };

  const clearAll = () => {
    setToken('');
    setDecodedToken(null);
    setError('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const renderTokenPart = (title: string, data: any, raw: string) => (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <Button size="sm" variant="outline" onClick={() => copyToClipboard(raw)}>
            <CopyIcon className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
        <pre className="bg-secondary p-4 rounded-md overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </Card>
  );

  const renderTimestamps = () => {
    if (!decodedToken?.payload) return null;

    const timestamps = [];
    if (decodedToken.payload.iat) {
      timestamps.push(
        <div key="iat">
          <strong>Issued At:</strong> {formatDate(decodedToken.payload.iat)}
        </div>
      );
    }
    if (decodedToken.payload.exp) {
      timestamps.push(
        <div key="exp">
          <strong>Expires At:</strong> {formatDate(decodedToken.payload.exp)}
        </div>
      );
    }
    if (decodedToken.payload.nbf) {
      timestamps.push(
        <div key="nbf">
          <strong>Not Valid Before:</strong> {formatDate(decodedToken.payload.nbf)}
        </div>
      );
    }

    if (timestamps.length === 0) return null;

    return (
      <Card className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium">Timestamps</h3>
          <div className="space-y-1 text-sm">
            {timestamps}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter JWT token..."
            className="min-h-[100px] font-mono"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div className="flex gap-2">
          <Button onClick={decodeToken}>Decode Token</Button>
            <Button variant="ghost" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-500">
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      {decodedToken && (
        <div className="space-y-4">
          {renderTokenPart('Header', decodedToken.header, token.split('.')[0])}
          {renderTokenPart('Payload', decodedToken.payload, token.split('.')[1])}
          {renderTimestamps()}
          <Card className="p-4 border-yellow-300 bg-yellow-50">
            <p className="text-sm text-yellow-800">
              This tool only <strong>decodes</strong> the JWT and runs entirely in your browser – tokens are
              not sent to any server. It does <strong>not verify</strong> the signature, issuer, audience, or
              any other claims, so always rely on your backend or auth provider to enforce security.
            </p>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Signature</h3>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(decodedToken.signature)}>
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <pre className="bg-secondary p-4 rounded-md overflow-x-auto font-mono">
                {decodedToken.signature}
              </pre>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 