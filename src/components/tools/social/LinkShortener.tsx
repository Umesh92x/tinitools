'use client'

import { useState, FormEvent } from 'react'
import { ClipboardDocumentIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface ShortenedLink {
  original: string
  shortCode: string
  shortUrl: string
  createdAt: Date
}

export function LinkShortener() {
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [shortenedLinks, setShortenedLinks] = useState<ShortenedLink[]>([])
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
      try {
        new URL(`https://${urlString}`)
        return true
      } catch {
        return false
      }
    }
  }

  const generateShortCode = (custom?: string): string => {
    if (custom && custom.trim()) {
      // Validate custom alias (alphanumeric and hyphens only)
      const alias = custom.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
      if (alias.length < 3 || alias.length > 20) {
        throw new Error('Custom alias must be 3-20 characters (letters, numbers, and hyphens only)')
      }
      return alias
    }
    // Generate random 6-character code
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const shortenUrl = (e?: FormEvent) => {
    if (e) e.preventDefault()

    setError(null)

    if (!url.trim()) {
      setError('Please enter a URL to shorten.')
      return
    }

    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    if (!validateUrl(normalizedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com).')
      return
    }

    try {
      const shortCode = generateShortCode(customAlias)
      
      // Check if custom alias already exists
      if (customAlias && shortenedLinks.some(link => link.shortCode === shortCode)) {
        setError('This custom alias is already in use. Please choose a different one.')
        return
      }

      // In a real application, this would be stored on a server
      // For now, we'll create a local shortened URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const shortUrl = `${baseUrl}/s/${shortCode}`

      const newLink: ShortenedLink = {
        original: normalizedUrl,
        shortCode,
        shortUrl,
        createdAt: new Date(),
      }

      setShortenedLinks([newLink, ...shortenedLinks])
      setUrl('')
      setCustomAlias('')
      showMessage('URL shortened successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL')
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showMessage(`${label} copied to clipboard!`)
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const deleteLink = (shortCode: string) => {
    setShortenedLinks(shortenedLinks.filter(link => link.shortCode !== shortCode))
    showMessage('Link deleted')
  }

  const handleReset = () => {
    setUrl('')
    setCustomAlias('')
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={shortenUrl} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Long URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://example.com/very/long/url/path"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the long URL you want to shorten. Include http:// or https://.
            </p>
          </div>

          <div>
            <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700">
              Custom Alias (optional)
            </label>
            <input
              type="text"
              id="customAlias"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="my-custom-link"
              pattern="[a-zA-Z0-9-]{3,20}"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional: Create a custom short code (3-20 characters, letters, numbers, and hyphens only).
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
              Shorten URL
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

        {shortenedLinks.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shortened Links</h3>
              <div className="space-y-3">
                {shortenedLinks.map((link) => (
                  <div
                    key={link.shortCode}
                    className="p-4 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Original URL</p>
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-700 truncate flex-1">{link.original}</p>
                          <button
                            onClick={() => copyToClipboard(link.original, 'Original URL')}
                            className="p-1 text-gray-600 hover:text-indigo-600"
                            title="Copy original URL"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Short URL</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-indigo-600 flex-1">{link.shortUrl}</p>
                          <button
                            onClick={() => copyToClipboard(link.shortUrl, 'Short URL')}
                            className="p-1 text-indigo-600 hover:text-indigo-700"
                            title="Copy short URL"
                          >
                            <ClipboardDocumentIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Code: <span className="font-mono">{link.shortCode}</span>
                        </p>
                        <button
                          onClick={() => deleteLink(link.shortCode)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Note:</h4>
              <p className="text-sm text-gray-600">
                This is a client-side URL shortener. Links are stored locally in your browser and will be lost when you clear your browser data. 
                For permanent shortened URLs, consider using services like bit.ly, tinyurl.com, or your own URL shortening service.
              </p>
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

