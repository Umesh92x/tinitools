'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ClockIcon, BookOpenIcon } from 'lucide-react';

export default function ReadingTimeCalculator() {
  const [text, setText] = useState('');
  const [wordsPerMinute, setWordsPerMinute] = useState(250); // Average reading speed
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  const calculateStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    setStats({
      words,
      characters,
      sentences,
      paragraphs,
      readingTime,
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    calculateStats(newText);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value) || 250;
    setWordsPerMinute(speed);
    calculateStats(text);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return 'Less than a minute';
    }
    if (minutes === 1) {
      return '1 minute';
    }
    return `${minutes} minutes`;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Reading Speed (words per minute)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                min="1"
                value={wordsPerMinute}
                onChange={handleSpeedChange}
              />
              <Button variant="outline" onClick={() => setWordsPerMinute(250)}>
                Reset to Average
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average adult reading speed is 250 words per minute
            </p>
          </div>

          <div>
            <Label>Text</Label>
            <Textarea
              placeholder="Paste your text here..."
              className="min-h-[200px] mt-1"
              value={text}
              onChange={handleTextChange}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Reading Time</h3>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatTime(stats.readingTime)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5" />
              <h3 className="font-medium">Text Statistics</h3>
            </div>
            <div className="space-y-1">
              <p>Words: {stats.words}</p>
              <p>Characters: {stats.characters}</p>
              <p>Sentences: {stats.sentences}</p>
              <p>Paragraphs: {stats.paragraphs}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 