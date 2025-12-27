import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import CronGenerator from '@/components/tools/dev/CronGenerator';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = generateMetadata({
  title: 'Cron Expression Generator',
  description: 'Free online cron expression generator - Create and understand cron expressions easily with our user-friendly interface. Perfect for scheduling tasks and jobs. No signup required.',
  path: '/dev/cron',
  keywords: ['cron generator', 'cron expression', 'cron schedule', 'cron maker', 'cron syntax', 'cron tool'],
});

export default function CronGeneratorPage() {
  const relatedTools = [
    { name: 'RegEx Tester', href: '/dev/regex' },
    { name: 'JSON Formatter', href: '/dev/json' },
    { name: 'JWT Decoder', href: '/dev/jwt' },
    { name: 'UUID Generator', href: '/dev/uuid' },
  ]

  return (
    <ToolLayout
      title="Cron Expression Generator"
      description="Free online cron expression generator - Create and understand cron expressions easily with our user-friendly interface. Perfect for scheduling tasks and jobs. No signup required."
      category="dev"
      categoryName="Developer Tools"
      relatedTools={relatedTools}
    >
      <CronGenerator />
    </ToolLayout>
  );
} 