import { Metadata } from 'next'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata: Metadata = genMeta({
  title: 'Currency Converter',
  description: 'Free currency converter - Convert between 160+ currencies with real-time exchange rates. Instant conversion, no signup required.',
  path: '/financial/currency',
  keywords: ['currency converter', 'exchange rate', 'currency conversion', 'forex converter', 'money converter'],
}) 