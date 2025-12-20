'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface Template {
  name: string
  description: string
  structure: string
}

interface Tone {
  name: string
  description: string
  emoji: string
}

const TEMPLATES: Template[] = [
  {
    name: 'Story',
    description: 'Share a personal experience or journey',
    structure: '🌟 [Hook]\n\n[Story/Experience]\n\n💭 [Reflection/Lesson]\n\n[Call-to-action]',
  },
  {
    name: 'Tips & Tricks',
    description: 'Share valuable advice or hacks',
    structure: '💡 [Topic Introduction]\n\n✨ Key Tips:\n1. [Tip 1]\n2. [Tip 2]\n3. [Tip 3]\n\n💪 [Motivational Close]',
  },
  {
    name: 'Product/Service',
    description: 'Promote without being too salesy',
    structure: '🎯 [Pain Point]\n\n✨ [Solution Introduction]\n\n🌟 [Benefits/Features]\n\n🔥 [Special Offer/Call-to-action]',
  },
  {
    name: 'Behind the Scenes',
    description: 'Share your process or daily life',
    structure: '👋 [Greeting]\n\n🎬 [BTS Moment]\n\n💫 [Interesting Detail/Insight]\n\n❓ [Engaging Question]',
  },
  {
    name: 'Quote & Reflection',
    description: 'Share inspiration with your thoughts',
    structure: '✨ "[Quote]"\n- [Author]\n\n💭 [Your Reflection]\n\n🤔 [Question for Engagement]',
  },
]

const TONES: Tone[] = [
  { name: 'Professional', description: 'Formal and business-like', emoji: '👔' },
  { name: 'Casual', description: 'Friendly and relaxed', emoji: '😊' },
  { name: 'Inspirational', description: 'Motivating and uplifting', emoji: '✨' },
  { name: 'Humorous', description: 'Fun and entertaining', emoji: '😄' },
  { name: 'Educational', description: 'Informative and helpful', emoji: '📚' },
]

export function CaptionGenerator() {
  const [topic, setTopic] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedTone, setSelectedTone] = useState<Tone | null>(null)
  const [keywords, setKeywords] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const generateCaption = () => {
    if (!topic || !selectedTemplate || !selectedTone) {
      setToastMessage('Please fill in all required fields')
      setToastType('error')
      setShowToast(true)
      return
    }

    // Generate caption based on template and tone
    let caption = selectedTemplate.structure

    // Replace placeholders with content based on topic and tone
    switch (selectedTemplate.name) {
      case 'Story':
        caption = caption
          .replace('[Hook]', `Ever wondered about ${topic}?`)
          .replace('[Story/Experience]', `Let me share my journey with ${topic}...`)
          .replace('[Reflection/Lesson]', `What I learned: ${topic} teaches us that success takes time`)
          .replace('[Call-to-action]', `What's your experience with ${topic}? Share below! 👇`)
        break
      case 'Tips & Tricks':
        caption = caption
          .replace('[Topic Introduction]', `Master ${topic} with these game-changing tips!`)
          .replace('[Tip 1]', `Start with the basics of ${topic}`)
          .replace('[Tip 2]', `Practice ${topic} consistently`)
          .replace('[Tip 3]', `Share your ${topic} journey`)
          .replace('[Motivational Close]', `You've got this! 💪`)
        break
      // Add more template-specific replacements
    }

    // Add keywords as hashtags
    if (keywords) {
      const hashtags = keywords
        .split(',')
        .map(keyword => `#${keyword.trim().toLowerCase().replace(/\s+/g, '')}`)
        .join(' ')
      caption += `\n\n${hashtags}`
    }

    setGeneratedCaption(caption)
    setToastMessage('Caption generated successfully!')
    setToastType('success')
    setShowToast(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCaption).then(() => {
      setToastMessage('Caption copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    })
  }

  const handleReset = () => {
    setTopic('')
    setSelectedTemplate(null)
    setSelectedTone(null)
    setKeywords('')
    setGeneratedCaption('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              What are you posting about?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., new product launch, travel experience, fitness journey"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a Template
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-md text-left ${
                    selectedTemplate?.name === template.name
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'bg-white border border-gray-200 hover:border-indigo-500'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-500">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.name}
                  onClick={() => setSelectedTone(tone)}
                  className={`p-2 rounded-md ${
                    selectedTone?.name === tone.name
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'bg-white border border-gray-200 hover:border-indigo-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{tone.emoji}</div>
                  <div className="font-medium text-sm">{tone.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Keywords for Hashtags (optional)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., marketing, business, entrepreneur (comma-separated)"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={generateCaption}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Caption
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>

        {generatedCaption && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Caption</h3>
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Copy to Clipboard
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-700">
                {generatedCaption}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalize the generated caption to match your voice</li>
                <li>• Add relevant emojis to make it more engaging</li>
                <li>• Keep it authentic and relatable</li>
                <li>• Test different templates and tones</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <AdUnit type="in-article" className="my-8" />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
} 