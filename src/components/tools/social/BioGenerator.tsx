'use client'

import { useState, FormEvent } from 'react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface BioTemplate {
  name: string
  description: string
  structure: string
}

const BIO_TEMPLATES: BioTemplate[] = [
  {
    name: 'Professional',
    description: 'Business-focused bio for LinkedIn, professional profiles',
    structure: '[Name] | [Title/Role]\n\n[Professional Summary]\n\n📍 [Location]\n💼 [Company/Industry]\n📧 [Contact]',
  },
  {
    name: 'Creative',
    description: 'Artistic and expressive bio for Instagram, Twitter',
    structure: '✨ [Creative Tagline]\n\n[Personal Story/Passion]\n\n🎨 [Creative Work]\n📸 [Portfolio/Social Links]',
  },
  {
    name: 'Influencer',
    description: 'Engaging bio for content creators and influencers',
    structure: '👋 [Greeting/Introduction]\n\n📱 [Content Type]\n\n🎯 [Niche/Topic]\n\n🔗 [Links]',
  },
  {
    name: 'Personal Brand',
    description: 'Personal branding bio with achievements',
    structure: '[Name] | [Expertise]\n\n🏆 [Achievements]\n\n💡 [Value Proposition]\n\n📬 [Contact]',
  },
  {
    name: 'Minimalist',
    description: 'Simple and clean bio',
    structure: '[Name]\n[One-liner]\n[Link]',
  },
]

const PLATFORM_LIMITS = {
  instagram: 150,
  twitter: 160,
  linkedin: 2200,
  facebook: 101,
  tiktok: 80,
}

export function BioGenerator() {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [company, setCompany] = useState('')
  const [expertise, setExpertise] = useState('')
  const [achievements, setAchievements] = useState('')
  const [contact, setContact] = useState('')
  const [links, setLinks] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<BioTemplate | null>(null)
  const [generatedBio, setGeneratedBio] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const generateBio = (e?: FormEvent) => {
    if (e) e.preventDefault()

    setError(null)

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!selectedTemplate) {
      setError('Please select a bio template.')
      return
    }

    let bio = selectedTemplate.structure

    // Replace placeholders with user input
    bio = bio
      .replace(/\[Name\]/g, name.trim())
      .replace(/\[Title\/Role\]/g, title.trim() || 'Professional')
      .replace(/\[Location\]/g, location.trim() || 'Worldwide')
      .replace(/\[Company\/Industry\]/g, company.trim() || 'Freelancer')
      .replace(/\[Contact\]/g, contact.trim() || 'Contact me')
      .replace(/\[Professional Summary\]/g, expertise.trim() || 'Experienced professional')
      .replace(/\[Creative Tagline\]/g, expertise.trim() || 'Creative Professional')
      .replace(/\[Personal Story\/Passion\]/g, achievements.trim() || 'Passionate about my work')
      .replace(/\[Creative Work\]/g, expertise.trim() || 'Digital Creator')
      .replace(/\[Portfolio\/Social Links\]/g, links.trim() || 'Link in bio')
      .replace(/\[Greeting\/Introduction\]/g, `Hi, I'm ${name.trim()}`)
      .replace(/\[Content Type\]/g, expertise.trim() || 'Content Creator')
      .replace(/\[Niche\/Topic\]/g, achievements.trim() || 'Lifestyle & Travel')
      .replace(/\[Links\]/g, links.trim() || 'Link in bio')
      .replace(/\[Expertise\]/g, expertise.trim() || 'Expert')
      .replace(/\[Achievements\]/g, achievements.trim() || 'Award-winning professional')
      .replace(/\[Value Proposition\]/g, expertise.trim() || 'Helping you achieve your goals')
      .replace(/\[One-liner\]/g, expertise.trim() || 'Making things happen')
      .replace(/\[Link\]/g, links.trim() || 'linktr.ee/username')

    setGeneratedBio(bio)
    showMessage('Bio generated successfully!')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedBio)
      showMessage('Bio copied to clipboard!')
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const handleReset = () => {
    setName('')
    setTitle('')
    setLocation('')
    setCompany('')
    setExpertise('')
    setAchievements('')
    setContact('')
    setLinks('')
    setSelectedTemplate(null)
    setGeneratedBio('')
    setError(null)
  }

  const getCharacterCount = () => {
    return generatedBio.length
  }

  const getPlatformStatus = (platform: keyof typeof PLATFORM_LIMITS) => {
    const count = getCharacterCount()
    const limit = PLATFORM_LIMITS[platform]
    return {
      count,
      limit,
      status: count > limit ? 'over' : count > limit * 0.9 ? 'warning' : 'good',
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={generateBio} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Template <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {BIO_TEMPLATES.map((template) => (
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title/Role
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="New York, USA"
              />
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company/Industry
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Tech Industry"
            />
          </div>

          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
              Expertise/Passion
            </label>
            <textarea
              id="expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="What you do or are passionate about"
            />
          </div>

          <div>
            <label htmlFor="achievements" className="block text-sm font-medium text-gray-700">
              Achievements/Story
            </label>
            <textarea
              id="achievements"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Your achievements or personal story"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                Contact
              </label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label htmlFor="links" className="block text-sm font-medium text-gray-700">
                Links
              </label>
              <input
                type="text"
                id="links"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="linktr.ee/username"
              />
            </div>
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
              Generate Bio
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

        {generatedBio && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Bio</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  Copy
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-700 mb-4 bg-white p-4 rounded border border-gray-200">
                {generatedBio}
              </div>

              {/* Character Count & Platform Status */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Character Count: <span className="font-bold">{getCharacterCount()}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
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
                          {status.count} / {limit}
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
                <li>• Keep it concise and engaging</li>
                <li>• Use emojis sparingly and appropriately</li>
                <li>• Include a clear call-to-action</li>
                <li>• Update your bio regularly</li>
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

