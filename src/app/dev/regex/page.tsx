import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import RegexTester from '@/components/tools/dev/RegexTester';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = generateMetadata({
  title: 'RegEx Tester',
  description: 'Free online regular expression tester - Test and debug regex patterns with real-time matching, highlighting, and group capture. No signup required.',
  path: '/dev/regex',
  keywords: ['regex tester', 'regular expression', 'regex validator', 'regex debugger', 'regex pattern matcher', 'regex tool'],
});

export default function RegexTesterPage() {
  const relatedTools = [
    { name: 'JSON Formatter', href: '/dev/json' },
    { name: 'HTML Entity Converter', href: '/dev/html-entities' },
    { name: 'JWT Decoder', href: '/dev/jwt' },
    { name: 'Cron Generator', href: '/dev/cron' },
  ]

  return (
    <ToolLayout
      title="RegEx Tester"
      description="Free online regular expression tester - Test and debug regex patterns with real-time matching, highlighting, and group capture. No signup required."
      category="dev"
      categoryName="Developer Tools"
      relatedTools={relatedTools}
    >
      <RegexTester />
    </ToolLayout>
  );
} 