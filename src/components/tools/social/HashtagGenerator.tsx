'use client'

import { useState, FormEvent } from 'react'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { Toast } from '@/components/ui/Toast'
import { AdUnit } from '@/components/ads/AdUnit'

interface HashtagGroup {
  category: string
  hashtags: string[]
}

const POPULAR_CATEGORIES = [
  'Photography',
  'Travel',
  'Food',
  'Fashion',
  'Fitness',
  'Art',
  'Business',
  'Technology',
  'Nature',
  'Music',
]

const TRENDING_HASHTAGS: HashtagGroup[] = [
  {
    category: 'General',
    hashtags: ['love', 'instagood', 'photooftheday', 'beautiful', 'happy', 'picoftheday', 'instadaily'],
  },
  {
    category: 'Photography',
    hashtags: ['photography', 'photo', 'photographer', 'naturephotography', 'photoshoot', 'portrait', 'streetphotography'],
  },
  {
    category: 'Travel',
    hashtags: ['travel', 'wanderlust', 'travelgram', 'instatravel', 'adventure', 'travelphotography', 'explore'],
  },
  {
    category: 'Food',
    hashtags: ['food', 'foodporn', 'foodie', 'instafood', 'yummy', 'foodphotography', 'delicious'],
  },
  {
    category: 'Fashion',
    hashtags: ['fashion', 'style', 'ootd', 'fashionblogger', 'streetstyle', 'fashionstyle', 'outfitoftheday'],
  },
  {
    category: 'Fitness',
    hashtags: ['fitness', 'workout', 'gym', 'fitlife', 'health', 'exercise', 'fitnessmotivation'],
  },
  {
    category: 'Art',
    hashtags: ['art', 'artist', 'artwork', 'creative', 'drawing', 'painting', 'digitalart'],
  },
  {
    category: 'Business',
    hashtags: ['business', 'entrepreneur', 'startup', 'marketing', 'success', 'leadership', 'motivation'],
  },
  {
    category: 'Technology',
    hashtags: ['tech', 'technology', 'innovation', 'coding', 'programming', 'ai', 'digital'],
  },
  {
    category: 'Nature',
    hashtags: ['nature', 'naturelovers', 'outdoors', 'landscape', 'mountains', 'sunset', 'wildlife'],
  },
  {
    category: 'Music',
    hashtags: ['music', 'musician', 'song', 'artist', 'musiclover', 'concert', 'guitar'],
  },
]

const PLATFORM_LIMITS = {
  instagram: 30,
  twitter: 2,
  linkedin: 5,
  facebook: 30,
}

export function HashtagGenerator() {
  const [topic, setTopic] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<string | null>(null)

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
      setShowToast(true)
  }

  const generateHashtags = (e?: FormEvent) => {
    if (e) e.preventDefault()

    setError(null)

    if (!topic.trim() && selectedCategories.length === 0) {
      setError('Please enter a topic or select at least one category.')
      return
    }

    // Collect hashtags from selected categories
    const categoryHashtags = TRENDING_HASHTAGS
      .filter(group => selectedCategories.includes(group.category))
      .flatMap(group => group.hashtags)

    // Generate topic-specific hashtags
    const topicHashtags = topic.trim()
      ? [
          `#${topic.toLowerCase().trim().replace(/\s+/g, '')}`,
          `#${topic.toLowerCase().trim().replace(/\s+/g, '')}photography`,
          `#${topic.toLowerCase().trim().replace(/\s+/g, '')}life`,
          `#${topic.toLowerCase().trim().replace(/\s+/g, '')}lover`,
          `#${topic.toLowerCase().trim().replace(/\s+/g, '')}gram`,
          `#${topic.toLowerCase().trim().replace(/\s+/g, '')}daily`,
          `#${topic.toLowerCase().trim().replace(/\s+/g, '')}inspiration`,
        ]
      : []

    // Combine and remove duplicates
    const hashtagSet = new Set([...categoryHashtags.map(h => `#${h}`), ...topicHashtags])
    const allHashtags = Array.from(hashtagSet)

    if (allHashtags.length === 0) {
      setError('No hashtags generated. Please try a different topic or select categories.')
      setGeneratedHashtags([])
      return
    }

    setGeneratedHashtags(allHashtags)
    setSelectedHashtags([])
    showMessage('Hashtags generated successfully!')
  }

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    )
  }

  const selectAllHashtags = () => {
    setSelectedHashtags([...generatedHashtags])
  }

  const deselectAllHashtags = () => {
    setSelectedHashtags([])
  }

  const copyToClipboard = async () => {
    try {
    const textToCopy = selectedHashtags.length > 0
      ? selectedHashtags.join(' ')
      : generatedHashtags.join(' ')

      await navigator.clipboard.writeText(textToCopy)
      showMessage(selectedHashtags.length > 0 
        ? `${selectedHashtags.length} selected hashtags copied!` 
        : 'All hashtags copied to clipboard!')
    } catch (err) {
      showMessage('Failed to copy to clipboard', 'error')
    }
  }

  const handleReset = () => {
    setTopic('')
    setSelectedCategories([])
    setGeneratedHashtags([])
    setSelectedHashtags([])
    setError(null)
  }

  const getPlatformStatus = (platform: keyof typeof PLATFORM_LIMITS) => {
    const count = selectedHashtags.length > 0 ? selectedHashtags.length : generatedHashtags.length
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
        <form onSubmit={generateHashtags} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Enter Your Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., sunset, coffee, travel"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter a topic to generate related hashtags. Leave empty if you only want category-based hashtags.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Categories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={(e) => {
                      setSelectedCategories(prev =>
                        e.target.checked
                          ? [...prev, category]
                          : prev.filter(c => c !== category)
                      )
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Select one or more categories to include relevant hashtags. You can combine with a topic.
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
              Generate Hashtags
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

        {generatedHashtags.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                <h3 className="text-lg font-medium text-gray-900">Generated Hashtags</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedHashtags.length > 0 
                      ? `${selectedHashtags.length} of ${generatedHashtags.length} selected`
                      : `${generatedHashtags.length} hashtags generated`}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-500"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  Copy {selectedHashtags.length > 0 ? 'Selected' : 'All'}
                </button>
              </div>

              {generatedHashtags.length > 0 && (
                <div className="mb-4 flex gap-2">
                  <button
                    onClick={selectAllHashtags}
                    className="text-xs text-indigo-600 hover:text-indigo-500"
                  >
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={deselectAllHashtags}
                    className="text-xs text-indigo-600 hover:text-indigo-500"
                  >
                    Deselect All
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto">
                {generatedHashtags.map((hashtag) => (
                  <button
                    key={hashtag}
                    type="button"
                    onClick={() => toggleHashtag(hashtag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedHashtags.includes(hashtag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hashtag}
                  </button>
                ))}
              </div>

              {/* Platform Limits */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Platform Limits:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(PLATFORM_LIMITS).map(([platform, limit]) => {
                    const status = getPlatformStatus(platform as keyof typeof PLATFORM_LIMITS)
                    const displayCount = selectedHashtags.length > 0 ? selectedHashtags.length : generatedHashtags.length
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
                          {displayCount} / {limit}
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
                <li>• Instagram allows up to 30 hashtags per post</li>
                <li>• Twitter/X works best with 1-2 hashtags</li>
                <li>• Mix popular and niche hashtags for better reach</li>
                <li>• Update your hashtags regularly</li>
                <li>• Avoid banned or spammy hashtags</li>
                <li>• Select hashtags that match your content</li>
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