'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Match {
  text: string;
  index: number;
  groups?: { [key: string]: string };
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [isMultiline, setIsMultiline] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(true);

  useEffect(() => {
    testRegex();
  }, [pattern, testText, flags]);

  const updateFlags = () => {
    let newFlags = 'g';
    if (!isCaseSensitive) newFlags += 'i';
    if (isMultiline) newFlags += 'm';
    setFlags(newFlags);
  };

  useEffect(() => {
    updateFlags();
  }, [isCaseSensitive, isMultiline]);

  const testRegex = () => {
    setError('');
    setMatches([]);

    if (!pattern || !testText) return;

    try {
      const regex = new RegExp(pattern, flags);
      const matches: Match[] = [];
      let match;

      while ((match = regex.exec(testText)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.groups,
        });

        // Prevent infinite loops for zero-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      setMatches(matches);
    } catch (err) {
      setError((err as Error).message);
      toast.error('Invalid regular expression');
    }
  };

  const clearAll = () => {
    setPattern('');
    setTestText('');
    setMatches([]);
    setError('');
  };

  const copyMatchesAsJson = async () => {
    if (!matches.length) {
      toast.error('No matches to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(matches, null, 2));
      toast.success('Matches copied as JSON');
    } catch {
      toast.error('Failed to copy matches');
    }
  };

  const getHighlightedText = () => {
    if (!matches.length || error) return testText;

    let result = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      // Add text before match
      if (match.index > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {testText.substring(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted match
      result.push(
        <span
          key={`match-${idx}`}
          className="bg-yellow-200 dark:bg-yellow-800"
        >
          {match.text}
        </span>
      );

      lastIndex = match.index + match.text.length;
    });

    // Add remaining text
    if (lastIndex < testText.length) {
      result.push(
        <span key="text-end">
          {testText.substring(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Regular Expression</Label>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="font-mono"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isCaseSensitive}
                onCheckedChange={setIsCaseSensitive}
              />
              <Label>Case Sensitive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={isMultiline}
                onCheckedChange={setIsMultiline}
              />
              <Label>Multiline</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Test Text</Label>
            <Textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={testRegex}>Test Regex</Button>
            <Button variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {error ? (
        <Card className="p-4 border-red-500">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : (
        <>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
              <h3 className="font-medium">Matches ({matches.length})</h3>
                {matches.length > 0 && (
                  <Button size="sm" variant="outline" onClick={copyMatchesAsJson}>
                    Copy as JSON
                  </Button>
                )}
              </div>
              <div className="font-mono whitespace-pre-wrap break-all">
                {testText && pattern && !matches.length && (
                  <span className="text-sm text-gray-500">No matches found.</span>
                )}
                {getHighlightedText()}
              </div>
            </div>
          </Card>

          {matches.length > 0 && (
            <Card className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">Match Details</h3>
                <div className="space-y-2">
                  {matches.map((match, idx) => (
                    <div key={idx} className="p-2 bg-secondary rounded">
                      <p>
                        Match {idx + 1}:{' '}
                        <span className="font-mono break-all">{match.text}</span>
                      </p>
                      <p>Index: {match.index}</p>
                      {match.groups && Object.keys(match.groups).length > 0 && (
                        <div>
                          <p>Groups:</p>
                          <pre className="text-sm">
                            {JSON.stringify(match.groups, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
} 