'use client'

import { useState, FormEvent } from 'react'
import { ClipboardDocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface UsernameStyle {
  name: string
  description: string
  generator: (name: string, keywords: string[]) => string[]
}

const USERNAME_STYLES: UsernameStyle[] = [
  {
    name: 'Simple',
    description: 'Clean and straightforward usernames',
    generator: (name, keywords) => {
      const base = name.toLowerCase().replace(/\s+/g, '')
      return [
        base,
        `${base}${Math.floor(Math.random() * 1000)}`,
        `${base}_${Math.floor(Math.random() * 100)}`,
        ...keywords.map(k => `${base}${k.toLowerCase()}`),
      ]
    },
  },
  {
    name: 'Professional',
    description: 'Business-appropriate usernames',
    generator: (name, keywords) => {
      const parts = name.toLowerCase().split(' ')
      const first = parts[0] || ''
      const last = parts[parts.length - 1] || ''
      return [
        `${first}${last}`,
        `${first}.${last}`,
        `${first}_${last}`,
        `${first}${last}${Math.floor(Math.random() * 100)}`,
        ...keywords.map(k => `${first}${k.toLowerCase()}${last}`),
      ]
    },
  },
  {
    name: 'Creative',
    description: 'Unique and creative combinations',
    generator: (name, keywords) => {
      const base = name.toLowerCase().replace(/\s+/g, '')
      const adjectives = ['cool', 'pro', 'official', 'real', 'the', 'mr', 'ms']
      return [
        `the${base}`,
        `${base}official`,
        `${base}pro`,
        `${base}${adjectives[Math.floor(Math.random() * adjectives.length)]}`,
        ...keywords.map(k => `${k.toLowerCase()}${base}`),
      ]
    },
  },
  {
    name: 'Gaming',
    description: 'Gamer-style usernames',
    generator: (name, keywords) => {
      const base = name.toLowerCase().replace(/\s+/g, '')
      const suffixes = ['x', 'pro', 'gamer', 'plays', 'zz', '99']
      return [
        `${base}${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
        `${base}_${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
        `${base}${Math.floor(Math.random() * 1000)}`,
        ...keywords.map(k => `${base}${k.toLowerCase()}gamer`),
      ]
    },
  },
]

export function UsernameGenerator() {
  const [name, setName] = useState('')
  const [keywords, setKeywords] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<UsernameStyle | null>(null)
  const [generatedUsernames, setGeneratedUsernames] = useState<string[]>([])
  const [favoriteUsernames, setFavoriteUsernames] = useState<string[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }

  const generateUsernames = (e?: FormEvent) => {
    if (e) e.preventDefault()

    setError(null)

    if (!name.trim()) {
      setError('Please enter your name or a base word.')
      return
    }

    if (!selectedStyle) {
      setError('Please select a username style.')
      return
    }

    const keywordList = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)

    const usernames = selectedStyle.generator(name.trim(), keywordList)
    // Remove duplicates and limit to 12
    const uniqueUsernames = Array.from(new Set(usernames)).slice(0, 12)

    if (uniqueUsernames.length === 0) {
      setError('Failed to generate usernames. Please try again.')
      return
    }

    setGeneratedUsernames(uniqueUsernames)
    setFavoriteUsernames([])
    showMessage(`${uniqueUsernames.length} usernames generated!`)
  }

  const toggleFavorite = (username: string) => {
    setFavoriteUsernames(prev =>
      prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username]
    )
  }

  const regenerateUsernames = () => {
    if (!name.trim() || !selectedStyle) {
      showMessage('Please enter a name and select a style first', 'error')
      return
    }
    generateUsernames()
  }

  const copyToClipboard = async (username: string) => {
    try {
      await navigator.clipboard.writeText(username)
      showMessage('Username copied to clipboard!')
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const copyAllFavorites = async () => {
    if (favoriteUsernames.length === 0) {
      showMessage('No favorite usernames selected', 'error')
      return
    }
    try {
      await navigator.clipboard.writeText(favoriteUsernames.join('\n'))
      showMessage(`${favoriteUsernames.length} favorite usernames copied!`)
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const checkAvailability = (username: string) => {
    // In a real app, this would check against platform APIs
    showMessage(`Checking availability for "${username}"... (This is a demo - real checks require API access)`)
  }

  const handleReset = () => {
    setName('')
    setKeywords('')
    setSelectedStyle(null)
    setGeneratedUsernames([])
    setFavoriteUsernames([])
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={generateUsernames} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name or Base Word <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="John Doe or johndoe"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter your name or any base word to generate usernames from.
            </p>
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
              Keywords (optional)
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="tech, developer, designer (comma-separated)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Add keywords to include in your usernames (comma-separated).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username Style <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {USERNAME_STYLES.map((style) => (
                <button
                  key={style.name}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`p-3 rounded-md text-left ${
                    selectedStyle?.name === style.name
                      ? 'bg-indigo-50 border-2 border-indigo-500'
                      : 'bg-white border border-gray-200 hover:border-indigo-500'
                  }`}
                >
                  <div className="font-medium">{style.name}</div>
                  <div className="text-sm text-gray-500">{style.description}</div>
                </button>
              ))}
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
              Generate Usernames
            </button>

            {generatedUsernames.length > 0 && (
              <button
                type="button"
                onClick={regenerateUsernames}
                className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Regenerate
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </form>

        {generatedUsernames.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Generated Usernames ({generatedUsernames.length})
                </h3>
                {favoriteUsernames.length > 0 && (
                  <button
                    onClick={copyAllFavorites}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    Copy Favorites ({favoriteUsernames.length})
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {generatedUsernames.map((username) => (
                  <div
                    key={username}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <span className="font-mono text-sm text-gray-900">{username}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFavorite(username)}
                        className={`p-1 rounded ${
                          favoriteUsernames.includes(username)
                            ? 'text-yellow-500'
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        title="Add to favorites"
                      >
                        ⭐
                      </button>
                      <button
                        onClick={() => copyToClipboard(username)}
                        className="p-1 text-gray-600 hover:text-indigo-600"
                        title="Copy username"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click the star to favorite usernames you like</li>
                <li>• Check username availability on your target platform</li>
                <li>• Keep usernames short and memorable</li>
                <li>• Avoid numbers if possible for a cleaner look</li>
                <li>• Make sure it reflects your brand or personality</li>
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

