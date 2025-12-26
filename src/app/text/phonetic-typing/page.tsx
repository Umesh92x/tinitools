import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import ToolLayout from '@/components/layout/ToolLayout'
import { PhoneticTyping } from '@/components/tools/text/PhoneticTyping'

export const metadata: Metadata = generateMetadata({
  title: 'Phonetic Typing - Type in English, Get Transliterated Text',
  description: 'Free online phonetic typing tool. Type in English using phonetic transliteration and get instant output in various scripts. Currently supports Hindi (Devanagari). Perfect for typing without a native keyboard.',
  path: '/text/phonetic-typing',
  keywords: ['phonetic typing', 'transliteration', 'english to hindi', 'phonetic transliteration', 'devanagari typing', 'phonetic keyboard'],
})

export default function PhoneticTypingPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Text to Speech', href: '/text/text-to-speech' },
    { name: 'Text Statistics', href: '/text/statistics' },
    { name: 'Line Break Remover', href: '/text/line-breaks' },
  ]

  return (
    <ToolLayout
      title="Phonetic Typing"
      description="Free online phonetic typing tool. Type in English using phonetic transliteration and get instant output in various scripts. Currently supports Hindi (Devanagari). Perfect for typing without a native keyboard."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <PhoneticTyping />
    </ToolLayout>
  )
}

