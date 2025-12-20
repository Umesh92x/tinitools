import { Metadata } from 'next';
import WritingSpeedTest from '@/components/tools/productivity/WritingSpeedTest';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'Writing Speed Test - Free Online Typing Test',
  description: 'Free online writing speed test. Test and improve your typing speed.',
  keywords: 'writing speed test, typing test, typing speed, wpm calculator, typing practice',
};

export default function WritingSpeedTestPage() {
  return (
    <ToolLayout
      title="Writing Speed Test"
      description="Test and improve your typing speed."
    >
      <WritingSpeedTest />
    </ToolLayout>
  );
} 