import { Braces, Code2, Regex, Timer, KeyRound, Fingerprint } from 'lucide-react'
import CategoryLayout from '@/components/layout/CategoryLayout'

export const metadata = {
  title: 'Developer Tools - TiniTools',
  description: 'Collection of free online tools for developers including JSON formatter, HTML entity converter, RegEx tester, Cron expression generator, JWT decoder, and UUID generator.',
  keywords: 'developer tools, web development tools, online tools, json formatter, html encoder, regex tester, cron generator, jwt decoder, uuid generator',
}

const tools = [
  {
    name: 'JSON Formatter',
    description: 'Format and validate JSON data with syntax highlighting',
    href: '/dev/json',
    icon: Braces,
  },
  {
    name: 'HTML Entity Converter',
    description: 'Convert special characters to HTML entities and vice versa',
    href: '/dev/html-entities',
    icon: Code2,
  },
  {
    name: 'RegEx Tester',
    description: 'Test and debug regular expressions with real-time matching',
    href: '/dev/regex',
    icon: Regex,
  },
  {
    name: 'Cron Expression Generator',
    description: 'Create and understand cron expressions easily',
    href: '/dev/cron',
    icon: Timer,
  },
  {
    name: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens (JWT)',
    href: '/dev/jwt',
    icon: KeyRound,
  },
  {
    name: 'UUID Generator',
    description: 'Generate V1 and V4 UUIDs in various formats',
    href: '/dev/uuid',
    icon: Fingerprint,
  },
]

export default function DevToolsPage() {
  return (
    <CategoryLayout
      title="Developer Tools"
      description="A collection of essential tools for developers to streamline their workflow."
      tools={tools}
    />
  )
} 