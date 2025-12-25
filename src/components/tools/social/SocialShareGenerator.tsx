'use client'

import { useState, FormEvent } from 'react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface SocialPlatform {
  name: string
  icon: string
  baseUrl: string
  color: string
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    name: 'Facebook',
    icon: '📘',
    baseUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Twitter',
    icon: '🐦',
    baseUrl: 'https://twitter.com/intent/tweet?url=',
    color: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    baseUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=',
    color: 'bg-blue-700 hover:bg-blue-800',
  },
  {
    name: 'WhatsApp',
    icon: '💬',
    baseUrl: 'https://wa.me/?text=',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Telegram',
    icon: '✈️',
    baseUrl: 'https://t.me/share/url?url=',
    color: 'bg-blue-400 hover:bg-blue-500',
  },
  {
    name: 'Reddit',
    icon: '🤖',
    baseUrl: 'https://reddit.com/submit?url=',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    name: 'Pinterest',
    icon: '📌',
    baseUrl: 'https://pinterest.com/pin/create/button/?url=',
    color: 'bg-red-600 hover:bg-red-700',
  },
  {
    name: 'Email',
    icon: '📧',
    baseUrl: 'mailto:?subject=',
    color: 'bg-gray-600 hover:bg-gray-700',
  },
]

export function SocialShareGenerator() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string>>({})
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      // Try adding https:// if no protocol
      try {
        new URL(`https://${urlString}`)
        return true
      } catch {
        return false
      }
    }
  }

  const generateShareLinks = (e?: FormEvent) => {
    if (e) e.preventDefault()

    setError(null)

    if (!url.trim()) {
      setError('Please enter a URL to share.')
      setGeneratedLinks({})
      return
    }

    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    if (!validateUrl(normalizedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com).')
      setGeneratedLinks({})
      return
    }

    const encodedUrl = encodeURIComponent(normalizedUrl)
    const encodedTitle = encodeURIComponent(title.trim() || '')
    const encodedDescription = encodeURIComponent(description.trim() || '')

    const links: Record<string, string> = {}

    SOCIAL_PLATFORMS.forEach((platform) => {
      let shareUrl = ''

      switch (platform.name) {
        case 'Facebook':
          shareUrl = `${platform.baseUrl}${encodedUrl}`
          break
        case 'Twitter':
          shareUrl = `${platform.baseUrl}${encodedUrl}${encodedTitle ? `&text=${encodedTitle}` : ''}`
          break
        case 'LinkedIn':
          shareUrl = `${platform.baseUrl}${encodedUrl}`
          break
        case 'WhatsApp':
          shareUrl = `${platform.baseUrl}${encodedTitle ? `${encodedTitle}%20${encodedUrl}` : encodedUrl}`
          break
        case 'Telegram':
          shareUrl = `${platform.baseUrl}${encodedUrl}${encodedTitle ? `&text=${encodedTitle}` : ''}`
          break
        case 'Reddit':
          shareUrl = `${platform.baseUrl}${encodedUrl}${encodedTitle ? `&title=${encodedTitle}` : ''}`
          break
        case 'Pinterest':
          shareUrl = `${platform.baseUrl}${encodedUrl}${encodedDescription ? `&description=${encodedDescription}` : ''}`
          break
        case 'Email':
          shareUrl = `${platform.baseUrl}${encodedTitle || 'Check this out'}${encodedUrl ? `&body=${encodedDescription || encodedUrl}` : ''}`
          break
        default:
          shareUrl = `${platform.baseUrl}${encodedUrl}`
      }

      links[platform.name] = shareUrl
    })

    setGeneratedLinks(links)
    showMessage('Share links generated successfully!')
  }

  const copyToClipboard = async (link: string, platformName: string) => {
    try {
      await navigator.clipboard.writeText(link)
      showMessage(`${platformName} share link copied!`)
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const openShareLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleReset = () => {
    setUrl('')
    setTitle('')
    setDescription('')
    setGeneratedLinks({})
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={generateShareLinks} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL to Share <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://example.com or example.com"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the URL you want to share. Include http:// or https://, or we'll add it automatically.
            </p>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a title for your share"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional title that will appear in the share (used by Twitter, WhatsApp, etc.).
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter a description for your share"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional description that will appear in the share (used by Pinterest, Email, etc.).
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
              Generate Share Links
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

        {Object.keys(generatedLinks).length > 0 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Share Links</h3>
              <div className="space-y-3">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const link = generatedLinks[platform.name]
                  if (!link) return null

                  return (
                    <div
                      key={platform.name}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <span className="font-medium text-gray-900">{platform.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(link, platform.name)}
                          className="p-2 text-gray-600 hover:text-indigo-600"
                          title="Copy link"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openShareLink(link)}
                          className={`px-4 py-2 rounded-md text-white text-sm ${platform.color}`}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click "Share" to open the platform's share dialog</li>
                <li>• Click the copy icon to copy the share link</li>
                <li>• Different platforms support different parameters (title, description)</li>
                <li>• Test your links before sharing publicly</li>
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

