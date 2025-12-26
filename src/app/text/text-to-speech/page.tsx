import ToolLayout from '@/components/layout/ToolLayout'
import { TextToSpeech } from '@/components/tools/text/TextToSpeech'
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Text to Speech Converter',
  description: 'Free text to speech converter - Convert text to natural-sounding speech instantly. Multiple languages and voices. No signup required.',
  path: '/text/text-to-speech',
  keywords: ['text to speech', 'tts', 'speech synthesis', 'voice generator', 'text reader'],
})

export default function TextToSpeechPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Password Generator', href: '/text/password' },
    { name: 'Text Statistics', href: '/text/statistics' },
    { name: 'Line Break Remover', href: '/text/line-breaks' },
  ]

  return (
    <ToolLayout
      title="Text to Speech Converter"
      description="Free text to speech converter - Convert text to natural-sounding speech instantly. Multiple languages and voices. No signup required."
      category="text"
      categoryName="Text & Writing Tools"
      relatedTools={relatedTools}
    >
      <TextToSpeech />
    </ToolLayout>
  )
} 