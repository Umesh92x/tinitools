'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CopyIcon } from 'lucide-react';

interface CronField {
  value: string;
  options: { label: string; value: string }[];
}

export default function CronGenerator() {
  const [minutes, setMinutes] = useState<CronField>({
    value: '*',
    options: [
      { label: 'Every minute', value: '*' },
      { label: 'Every 5 minutes', value: '*/5' },
      { label: 'Every 15 minutes', value: '*/15' },
      { label: 'Every 30 minutes', value: '*/30' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const [hours, setHours] = useState<CronField>({
    value: '*',
    options: [
      { label: 'Every hour', value: '*' },
      { label: 'Every 2 hours', value: '*/2' },
      { label: 'Every 4 hours', value: '*/4' },
      { label: 'Every 6 hours', value: '*/6' },
      { label: 'Every 12 hours', value: '*/12' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const [dayOfMonth, setDayOfMonth] = useState<CronField>({
    value: '*',
    options: [
      { label: 'Every day', value: '*' },
      { label: 'Every 2 days', value: '*/2' },
      { label: 'Every week', value: '*/7' },
      { label: 'First day of month', value: '1' },
      { label: 'Last day of month', value: 'L' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const [month, setMonth] = useState<CronField>({
    value: '*',
    options: [
      { label: 'Every month', value: '*' },
      { label: 'Every 3 months', value: '*/3' },
      { label: 'Every 6 months', value: '*/6' },
      { label: 'January', value: '1' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const [dayOfWeek, setDayOfWeek] = useState<CronField>({
    value: '*',
    options: [
      { label: 'Every day', value: '*' },
      { label: 'Weekdays', value: '1-5' },
      { label: 'Weekends', value: '0,6' },
      { label: 'Monday', value: '1' },
      { label: 'Custom', value: 'custom' },
    ],
  });

  const [customValues, setCustomValues] = useState({
    minutes: '',
    hours: '',
    dayOfMonth: '',
    month: '',
    dayOfWeek: '',
  });

  const resetAll = () => {
    setMinutes({
      value: '*',
      options: minutes.options,
    });
    setHours({
      value: '*',
      options: hours.options,
    });
    setDayOfMonth({
      value: '*',
      options: dayOfMonth.options,
    });
    setMonth({
      value: '*',
      options: month.options,
    });
    setDayOfWeek({
      value: '*',
      options: dayOfWeek.options,
    });
    setCustomValues({
      minutes: '',
      hours: '',
      dayOfMonth: '',
      month: '',
      dayOfWeek: '',
    });
  };

  const getCronExpression = () => {
    const getValue = (field: keyof typeof customValues, cronField: CronField) => {
      return cronField.value === 'custom' ? customValues[field] : cronField.value;
    };

    return `${getValue('minutes', minutes)} ${getValue('hours', hours)} ${getValue('dayOfMonth', dayOfMonth)} ${getValue('month', month)} ${getValue('dayOfWeek', dayOfWeek)}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCronExpression());
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getDescription = () => {
    const expr = getCronExpression();
    let description = 'Runs ';

    if (expr === '* * * * *') {
      return 'Runs every minute';
    }

    if (minutes.value === '*') {
      description += 'every minute';
    } else if (minutes.value.startsWith('*/')) {
      description += `every ${minutes.value.substring(2)} minutes`;
    }

    if (hours.value !== '*') {
      if (hours.value.startsWith('*/')) {
        description += ` every ${hours.value.substring(2)} hours`;
      } else if (hours.value !== 'custom') {
        description += ` at hour ${hours.value}`;
      }
    }

    if (dayOfMonth.value !== '*' && dayOfMonth.value !== 'custom') {
      if (dayOfMonth.value === 'L') {
        description += ' on the last day of the month';
      } else if (dayOfMonth.value.startsWith('*/')) {
        description += ` every ${dayOfMonth.value.substring(2)} days`;
      } else {
        description += ` on day ${dayOfMonth.value} of the month`;
      }
    }

    if (month.value !== '*' && month.value !== 'custom') {
      if (month.value.startsWith('*/')) {
        description += ` every ${month.value.substring(2)} months`;
      } else {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        description += ` in ${monthNames[parseInt(month.value) - 1]}`;
      }
    }

    if (dayOfWeek.value !== '*' && dayOfWeek.value !== 'custom') {
      if (dayOfWeek.value === '1-5') {
        description += ' on weekdays';
      } else if (dayOfWeek.value === '0,6') {
        description += ' on weekends';
      } else {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        description += ` on ${dayNames[parseInt(dayOfWeek.value)]}`;
      }
    }

    return description;
  };

  const renderField = (
    label: string,
    field: CronField,
    setField: (field: CronField) => void,
    customKey: keyof typeof customValues
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Select
          value={field.value}
          onValueChange={(value) => setField({ ...field, value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {field.value === 'custom' && (
          <Input
            value={customValues[customKey]}
            onChange={(e) => setCustomValues({ ...customValues, [customKey]: e.target.value })}
            placeholder="Enter custom value"
            className="flex-1"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          {renderField('Minutes', minutes, setMinutes, 'minutes')}
          {renderField('Hours', hours, setHours, 'hours')}
          {renderField('Day of Month', dayOfMonth, setDayOfMonth, 'dayOfMonth')}
          {renderField('Month', month, setMonth, 'month')}
          {renderField('Day of Week', dayOfWeek, setDayOfWeek, 'dayOfWeek')}
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Generated Cron Expression</h3>
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <CopyIcon className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
            {getCronExpression()}
          </pre>
          <p className="text-sm text-muted-foreground">{getDescription()}</p>
        </div>
      </Card>
    </div>
  );
} 