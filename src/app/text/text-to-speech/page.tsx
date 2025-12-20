import ToolLayout from '@/components/layout/ToolLayout'
import { TextToSpeech } from '@/components/tools/text/TextToSpeech'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Text to Speech Converter',
  description: 'Convert text to natural-sounding speech. Support for multiple languages and voices.',
  keywords: ['text to speech', 'tts', 'speech synthesis', 'voice generator', 'text reader'],
})

export default function TextToSpeechPage() {
  return (
    <ToolLayout
      title="Text to Speech Converter"
      description="Convert text to natural-sounding speech. Support for multiple languages and voices."
    >
      <TextToSpeech />
    </ToolLayout>
  )
} 