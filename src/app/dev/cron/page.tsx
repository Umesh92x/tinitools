import { Metadata } from 'next';
import CronGenerator from '@/components/tools/dev/CronGenerator';
import ToolLayout from '@/components/layout/ToolLayout';

export const metadata: Metadata = {
  title: 'Cron Expression Generator - Free Online Cron Tool',
  description: 'Free online cron expression generator. Create and understand cron expressions easily with our user-friendly interface. Perfect for scheduling tasks and jobs.',
  keywords: 'cron generator, cron expression, cron schedule, cron maker, cron syntax, cron tool',
};

export default function CronGeneratorPage() {
  return (
    <ToolLayout
      title="Cron Expression Generator"
      description="Create and understand cron expressions easily with our user-friendly interface."
    >
      <CronGenerator />
    </ToolLayout>
  );
} 