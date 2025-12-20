import { Metadata } from 'next';
import RegexTester from '@/components/tools/dev/RegexTester';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'RegEx Tester - Free Online Regular Expression Tool',
  description: 'Free online regular expression tester with real-time matching, highlighting, and group capture. Test and debug your regex patterns easily.',
  keywords: 'regex tester, regular expression, regex validator, regex debugger, regex pattern matcher, regex tool',
};

export default function RegexTesterPage() {
  return (
    <ToolLayout
      title="RegEx Tester"
      description="Test and debug your regular expressions with real-time matching and highlighting."
    >
      <RegexTester />
    </ToolLayout>
  );
} 