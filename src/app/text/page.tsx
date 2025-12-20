import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Type, 
  WrapText, 
  MessageSquare, 
  Quote, 
  KeyRound, 
  FileText,
  GitCompare,
  FileCode
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Text & Writing Tools',
  description: 'Free online tools for text manipulation and writing tasks',
  path: '/text',
  keywords: ['text tools', 'writing tools', 'text converter', 'text manipulation'],
})

export default function TextTools() {
const tools = [
  {
      title: 'Case Converter',
    description: 'Convert text between different cases: uppercase, lowercase, title case, and more.',
    href: '/text/case-converter',
      icon: Type,
  },
  {
      title: 'Line Break Remover',
    description: 'Remove line breaks from text. Convert multiple lines into a single line or paragraphs.',
    href: '/text/line-breaks',
      icon: WrapText,
  },
  {
      title: 'Text to Speech',
    description: 'Convert text to natural-sounding speech. Support for multiple languages and voices.',
    href: '/text/text-to-speech',
      icon: MessageSquare,
  },
  {
      title: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text. Customize length and format.',
    href: '/text/lorem-ipsum',
      icon: Quote,
  },
  {
      title: 'Password Generator',
    description: 'Generate secure passwords with customizable options for length, characters, and complexity.',
    href: '/text/password',
      icon: KeyRound,
  },
  {
      title: 'Text Statistics',
      description: 'Get detailed statistics about your text including word count, character count, and more.',
      href: '/text/statistics',
      icon: FileText,
    },
    {
      title: 'Text Diff Checker',
    description: 'Compare two texts and highlight the differences. Perfect for finding changes between versions.',
    href: '/text/diff',
      icon: GitCompare,
  },
  {
      title: 'Markdown Preview',
    description: 'Live markdown editor with instant preview. Supports GitHub Flavored Markdown and common extensions.',
    href: '/text/markdown',
      icon: FileCode,
  },
]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Text & Writing Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Free online tools for text manipulation and writing tasks
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 