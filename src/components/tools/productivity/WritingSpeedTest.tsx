'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { RefreshCw, Play, Square, Timer, AlertCircle } from 'lucide-react';

const sampleTexts = {
  short: [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.`,
    
    `Programming is the art of telling another human what one wants the computer to do. It requires both technical skill and creativity.`,
    
    `Success is not final, failure is not fatal: it is the courage to continue that counts. Keep practicing to improve your skills.`
  ],
  medium: [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. As the sun sets on the horizon, casting long shadows across the peaceful meadow, a gentle breeze rustles through the leaves.`,
    
    `In a world of digital transformation, typing speed has become an essential skill for productivity and efficiency. From sending emails to writing code, our fingers dance across keyboards daily, translating thoughts into text.`,
    
    `Programming is the art of telling another human what one wants the computer to do. It requires both technical skill and creativity. As developers, we spend countless hours crafting elegant solutions to complex problems.`
  ],
  long: [
    `The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. As the sun sets on the horizon, casting long shadows across the peaceful meadow, a gentle breeze rustles through the leaves. The world seems to slow down in these moments, allowing us to appreciate the simple beauty of nature. In these quiet times, we find our thoughts wandering to distant places and dreams yet to be realized.`,
    
    `In a world of digital transformation, typing speed has become an essential skill for productivity and efficiency. From sending emails to writing code, our fingers dance across keyboards daily, translating thoughts into text at remarkable speeds. The modern workplace demands not just accuracy, but also velocity in our digital communications. As technology continues to evolve, our ability to keep pace with these changes becomes increasingly important.`,
    
    `Programming is the art of telling another human what one wants the computer to do. It requires both technical skill and creativity. As developers, we spend countless hours crafting elegant solutions to complex problems, writing code that must be both efficient and maintainable. The best programs are those that can be easily understood by others, with clear documentation and logical structure.`
  ]
};

interface TestStats {
  wpm: number;
  errors: number;
  time: number;
  rating: string;
  feedback: string;
}

// WPM benchmarks
const speedRatings = [
  { min: 0, max: 20, rating: 'Beginner', feedback: 'Keep practicing! Regular practice will help improve your speed.' },
  { min: 21, max: 40, rating: 'Average', feedback: 'You\'re doing well! Keep practicing to improve further.' },
  { min: 41, max: 60, rating: 'Good', feedback: 'Great typing speed! You\'re above average.' },
  { min: 61, max: 80, rating: 'Professional', feedback: 'Excellent! You have professional-level typing speed.' },
  { min: 81, Infinity, rating: 'Expert', feedback: 'Outstanding! You\'re among the fastest typists!' },
];

export default function WritingSpeedTest() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TestStats | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentErrors, setCurrentErrors] = useState(0);
  const [textLength, setTextLength] = useState<'short' | 'medium' | 'long'>('medium');

  const getRandomText = useCallback(() => {
    const textsForLength = sampleTexts[textLength];
    const randomIndex = Math.floor(Math.random() * textsForLength.length);
    return textsForLength[randomIndex];
  }, [textLength]);

  const resetTest = useCallback(() => {
    setText(getRandomText());
    setUserInput('');
    setIsStarted(false);
    setStartTime(null);
    setStats(null);
    setElapsedTime(0);
    setCurrentCharIndex(0);
    setCurrentErrors(0);
  }, [getRandomText]);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isStarted && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isStarted, startTime]);

  const getRating = (wpm: number): { rating: string; feedback: string } => {
    const rating = speedRatings.find(r => wpm >= r.min && (!r.max || wpm <= r.max));
    return rating || speedRatings[0];
  };

  const calculateStats = () => {
    if (!startTime) return;

    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 60000;
    const words = text.trim().split(/\s+/).length;
    const wpm = Math.round(words / timeInMinutes);

    const { rating, feedback } = getRating(wpm);

    setStats({
      wpm,
      errors: currentErrors,
      time: Math.round(timeInMinutes * 60),
      rating,
      feedback
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!isStarted && value) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    // Count mismatched characters as errors
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errors++;
      }
    }
    setCurrentErrors(errors);
    setCurrentCharIndex(value.length);
    setUserInput(value);

    // Complete the test when the input length matches the text length
    if (value.length === text.length) {
      calculateStats();
      setIsStarted(false);
      toast.success('Test completed! Check your results below.');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-500';
    if (accuracy >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Sample Text</h3>
            <div className="flex items-center gap-4">
              <select
                className="px-3 py-1.5 rounded-md border bg-background text-sm"
                value={textLength}
                onChange={(e) => {
                  setTextLength(e.target.value as 'short' | 'medium' | 'long');
                  resetTest();
                }}
              >
                <option value="short">Short (2-3 lines)</option>
                <option value="medium">Medium (3-4 lines)</option>
                <option value="long">Long (5+ lines)</option>
              </select>
              {isStarted && (
                <div className="flex items-center gap-2 text-primary">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
              )}
              <Button variant="outline" onClick={resetTest}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Text
              </Button>
            </div>
          </div>
          <div className="text-lg leading-relaxed p-4 bg-secondary/50 rounded-lg font-mono">
            {text.split('').map((char, index) => {
              let className = '';
              if (index < currentCharIndex) {
                className = userInput[index] === char ? 'text-green-500' : 'text-red-500';
              } else if (index === currentCharIndex) {
                className = 'bg-primary/20';
              }
              return (
                <span key={index} className={className}>
                  {char}
                </span>
              );
            })}
          </div>
          {!isStarted && !stats && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>Start typing to begin the test. The timer will start automatically.</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {isStarted ? (
              <Square className="w-5 h-5 text-destructive animate-pulse" />
            ) : (
              <Play className="w-5 h-5 text-primary" />
            )}
            <h3 className="font-medium">
              {isStarted ? 'Test in Progress...' : 'Start Typing'}
            </h3>
          </div>
          <textarea
            className="w-full min-h-[100px] p-4 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            disabled={!!stats}
          />
        </div>
      </Card>

      {stats && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Speed (WPM)
                </h4>
                <p className="text-2xl font-bold text-primary">{stats.wpm}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Total Errors
                </h4>
                <p className="text-2xl font-bold text-destructive">{stats.errors}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                <p className="text-2xl font-bold">{stats.time}s</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Your Rating: {stats.rating}</h4>
              <p className="text-muted-foreground">{stats.feedback}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 