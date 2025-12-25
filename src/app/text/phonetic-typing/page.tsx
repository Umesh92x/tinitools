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
  return (
    <ToolLayout
      title="Phonetic Typing"
      description="Type in English using phonetic transliteration and get instant output in various scripts. Currently supports Hindi (Devanagari). Perfect for typing without a native keyboard."
    >
      <PhoneticTyping />
    </ToolLayout>
  )
}

