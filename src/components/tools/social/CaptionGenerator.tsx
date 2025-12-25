'use client'

import { useState, FormEvent } from 'react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
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

const PLATFORM_LIMITS = {
  instagram: 2200,
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
}

export function CaptionGenerator() {
  const [topic, setTopic] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedTone, setSelectedTone] = useState<Tone | null>(null)
  const [keywords, setKeywords] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
      setShowToast(true)
  }

  const getToneBasedText = (baseText: string, tone: Tone): string => {
    const toneVariations: Record<string, Record<string, string>> = {
      Professional: {
        'wondered': 'explored',
        'Let me share': 'I would like to present',
        'What I learned': 'Key insights',
        'What\'s your experience': 'I would appreciate your perspective',
      },
      Casual: {
        'wondered': 'thought about',
        'Let me share': 'Let me tell you',
        'What I learned': 'Here\'s what I found',
        'What\'s your experience': 'What do you think',
      },
      Inspirational: {
        'wondered': 'dreamed about',
        'Let me share': 'I\'m excited to share',
        'What I learned': 'The wisdom I gained',
        'What\'s your experience': 'What inspires you',
      },
      Humorous: {
        'wondered': 'laughed about',
        'Let me share': 'Buckle up, here\'s',
        'What I learned': 'Plot twist',
        'What\'s your experience': 'Spill the tea',
      },
      Educational: {
        'wondered': 'researched',
        'Let me share': 'Let me explain',
        'What I learned': 'Key findings',
        'What\'s your experience': 'What have you discovered',
      },
    }

    let text = baseText
    const variations = toneVariations[tone.name] || {}
    Object.entries(variations).forEach(([key, value]) => {
      text = text.replace(new RegExp(key, 'gi'), value)
    })
    return text
  }

  const generateCaption = (e?: FormEvent) => {
    if (e) e.preventDefault()

    setError(null)

    if (!topic.trim()) {
      setError('Please enter a topic for your post.')
      return
    }

    if (!selectedTemplate) {
      setError('Please select a template.')
      return
    }

    if (!selectedTone) {
      setError('Please select a tone.')
      return
    }

    // Generate caption based on template and tone
    let caption = selectedTemplate.structure
    const topicLower = topic.toLowerCase().trim()

    // Replace placeholders with content based on topic and tone
    switch (selectedTemplate.name) {
      case 'Story':
        caption = caption
          .replace('[Hook]', getToneBasedText(`Ever wondered about ${topic}?`, selectedTone))
          .replace('[Story/Experience]', getToneBasedText(`Let me share my journey with ${topic}...`, selectedTone))
          .replace('[Reflection/Lesson]', getToneBasedText(`What I learned: ${topic} teaches us that success takes time and dedication.`, selectedTone))
          .replace('[Call-to-action]', getToneBasedText(`What's your experience with ${topic}? Share below! 👇`, selectedTone))
        break
      case 'Tips & Tricks':
        caption = caption
          .replace('[Topic Introduction]', getToneBasedText(`Master ${topic} with these game-changing tips!`, selectedTone))
          .replace('[Tip 1]', `Start with the basics of ${topic}`)
          .replace('[Tip 2]', `Practice ${topic} consistently`)
          .replace('[Tip 3]', `Share your ${topic} journey with others`)
          .replace('[Motivational Close]', `You've got this! 💪`)
        break
      case 'Product/Service':
        caption = caption
          .replace('[Pain Point]', `Struggling with ${topic}? You're not alone.`)
          .replace('[Solution Introduction]', `Introducing a solution that makes ${topic} easier and more effective.`)
          .replace('[Benefits/Features]', `✨ Easy to use\n✨ Time-saving\n✨ Proven results`)
          .replace('[Special Offer/Call-to-action]', `Ready to transform your ${topic}? Let's connect! 🔥`)
        break
      case 'Behind the Scenes':
        caption = caption
          .replace('[Greeting]', `Hey everyone! 👋`)
          .replace('[BTS Moment]', `Today I'm sharing a behind-the-scenes look at ${topic}.`)
          .replace('[Interesting Detail/Insight]', `Here's something you might not know about ${topic}...`)
          .replace('[Engaging Question]', `What would you like to know about ${topic}? Drop your questions below! ❓`)
        break
      case 'Quote & Reflection':
        caption = caption
          .replace('[Quote]', `Success is not final, failure is not fatal: it is the courage to continue that counts.`)
          .replace('[Author]', `Winston Churchill`)
          .replace('[Your Reflection]', `This quote resonates deeply with my journey in ${topic}. Every setback is a setup for a comeback.`)
          .replace('[Question for Engagement]', `What quote inspires you in your ${topic} journey? 🤔`)
        break
    }

    // Add keywords as hashtags
    if (keywords.trim()) {
      const hashtags = keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0)
        .map(keyword => `#${keyword.toLowerCase().replace(/\s+/g, '')}`)
        .join(' ')
      if (hashtags) {
      caption += `\n\n${hashtags}`
      }
    }

    setGeneratedCaption(caption)
    showMessage('Caption generated successfully!')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCaption)
      showMessage('Caption copied to clipboard!')
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const handleReset = () => {
    setTopic('')
    setSelectedTemplate(null)
    setSelectedTone(null)
    setKeywords('')
    setGeneratedCaption('')
    setError(null)
  }

  const getCharacterCount = () => {
    return generatedCaption.length
  }

  const getPlatformStatus = (platform: keyof typeof PLATFORM_LIMITS) => {
    const count = getCharacterCount()
    const limit = PLATFORM_LIMITS[platform]
    const percentage = (count / limit) * 100
    return {
      count,
      limit,
      percentage,
      status: count > limit ? 'over' : count > limit * 0.9 ? 'warning' : 'good',
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={generateCaption} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              What are you posting about? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., new product launch, travel experience, fitness journey"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the main topic or theme for your social media post.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a Template <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  type="button"
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
            {!selectedTemplate && (
              <p className="mt-1 text-xs text-gray-500">
                Select a template that matches your post type.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tone <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.name}
                  type="button"
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
            {!selectedTone && (
              <p className="mt-1 text-xs text-gray-500">
                Choose the tone that best fits your audience and message.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords for Hashtags (optional)
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., marketing, business, entrepreneur (comma-separated)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter keywords separated by commas. They will be converted to hashtags.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Caption
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </form>

        {generatedCaption && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Caption</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  Copy
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-700 mb-4">
                {generatedCaption}
              </div>

              {/* Character Count & Platform Status */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Character Count: <span className="font-bold">{getCharacterCount()}</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(PLATFORM_LIMITS).map(([platform, limit]) => {
                    const status = getPlatformStatus(platform as keyof typeof PLATFORM_LIMITS)
                    return (
                      <div
                        key={platform}
                        className={`p-2 rounded ${
                          status.status === 'over'
                            ? 'bg-red-50 text-red-700'
                            : status.status === 'warning'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        <div className="font-medium capitalize">{platform}</div>
                        <div>
                          {status.count} / {limit.toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalize the generated caption to match your voice</li>
                <li>• Add relevant emojis to make it more engaging</li>
                <li>• Keep it authentic and relatable</li>
                <li>• Test different templates and tones</li>
                <li>• Check character limits for your target platform</li>
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