'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface MetaTags {
  title: string
  description: string
  keywords: string
  author: string
  viewport: string
  robots: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  twitterSite: string
  twitterCreator: string
}

const defaultMetaTags: MetaTags = {
  title: '',
  description: '',
  keywords: '',
  author: '',
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogUrl: '',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterSite: '',
  twitterCreator: '',
}

export function MetaTagGenerator() {
  const [metaTags, setMetaTags] = useState<MetaTags>(defaultMetaTags)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [output, setOutput] = useState('')

  const handleInputChange = (key: keyof MetaTags, value: string) => {
    setMetaTags(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'title' && !prev.ogTitle && { ogTitle: value }),
      ...(key === 'title' && !prev.twitterTitle && { twitterTitle: value }),
      ...(key === 'description' && !prev.ogDescription && { ogDescription: value }),
      ...(key === 'description' && !prev.twitterDescription && { twitterDescription: value }),
    }))
  }

  const generateMetaTags = () => {
    if (!metaTags.title || !metaTags.description) {
      setToastMessage('Title and description are required')
      setToastType('error')
      setShowToast(true)
      return
    }

    const tags = []

    // Basic meta tags
    tags.push(`<title>${metaTags.title}</title>`)
    tags.push(`<meta name="description" content="${metaTags.description}" />`)
    if (metaTags.keywords) tags.push(`<meta name="keywords" content="${metaTags.keywords}" />`)
    if (metaTags.author) tags.push(`<meta name="author" content="${metaTags.author}" />`)
    tags.push(`<meta name="viewport" content="${metaTags.viewport}" />`)
    tags.push(`<meta name="robots" content="${metaTags.robots}" />`)

    // Open Graph meta tags
    if (metaTags.ogTitle) tags.push(`<meta property="og:title" content="${metaTags.ogTitle}" />`)
    if (metaTags.ogDescription) tags.push(`<meta property="og:description" content="${metaTags.ogDescription}" />`)
    if (metaTags.ogImage) tags.push(`<meta property="og:image" content="${metaTags.ogImage}" />`)
    if (metaTags.ogUrl) tags.push(`<meta property="og:url" content="${metaTags.ogUrl}" />`)
    tags.push('<meta property="og:type" content="website" />')

    // Twitter Card meta tags
    tags.push(`<meta name="twitter:card" content="${metaTags.twitterCard}" />`)
    if (metaTags.twitterTitle) tags.push(`<meta name="twitter:title" content="${metaTags.twitterTitle}" />`)
    if (metaTags.twitterDescription) tags.push(`<meta name="twitter:description" content="${metaTags.twitterDescription}" />`)
    if (metaTags.twitterImage) tags.push(`<meta name="twitter:image" content="${metaTags.twitterImage}" />`)
    if (metaTags.twitterSite) tags.push(`<meta name="twitter:site" content="${metaTags.twitterSite}" />`)
    if (metaTags.twitterCreator) tags.push(`<meta name="twitter:creator" content="${metaTags.twitterCreator}" />`)

    setOutput(tags.join('\n'))
    setToastMessage('Meta tags generated successfully!')
    setToastType('success')
    setShowToast(true)
  }

  const handleCopy = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setToastMessage('Meta tags copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      setToastMessage('Failed to copy to clipboard')
      setToastType('error')
      setShowToast(true)
    }
  }

  const handleReset = () => {
    setMetaTags(defaultMetaTags)
    setOutput('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Meta Tags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  value={metaTags.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={metaTags.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Keywords
                </label>
                <input
                  type="text"
                  value={metaTags.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  value={metaTags.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Open Graph Meta Tags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OG Title
                </label>
                <input
                  type="text"
                  value={metaTags.ogTitle}
                  onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                  placeholder="Same as title if left empty"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OG Description
                </label>
                <textarea
                  value={metaTags.ogDescription}
                  onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                  placeholder="Same as description if left empty"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={metaTags.ogImage}
                  onChange={(e) => handleInputChange('ogImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  OG URL
                </label>
                <input
                  type="url"
                  value={metaTags.ogUrl}
                  onChange={(e) => handleInputChange('ogUrl', e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Twitter Card Meta Tags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter Card Type
                </label>
                <select
                  value={metaTags.twitterCard}
                  onChange={(e) => handleInputChange('twitterCard', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary with Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter Title
                </label>
                <input
                  type="text"
                  value={metaTags.twitterTitle}
                  onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                  placeholder="Same as title if left empty"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter Description
                </label>
                <textarea
                  value={metaTags.twitterDescription}
                  onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                  placeholder="Same as description if left empty"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter Image URL
                </label>
                <input
                  type="url"
                  value={metaTags.twitterImage}
                  onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter @username
                </label>
                <input
                  type="text"
                  value={metaTags.twitterSite}
                  onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                  placeholder="@yourusername"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Twitter Creator @username
                </label>
                <input
                  type="text"
                  value={metaTags.twitterCreator}
                  onChange={(e) => handleInputChange('twitterCreator', e.target.value)}
                  placeholder="@creator"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={generateMetaTags}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Meta Tags
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Reset Form
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">Generated Meta Tags</h3>
            <button
              onClick={handleCopy}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Copy to Clipboard
            </button>
          </div>
          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{output}</code>
          </pre>
        </div>
      )}

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