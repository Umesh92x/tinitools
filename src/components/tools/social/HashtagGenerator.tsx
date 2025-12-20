'use client'

import { useState } from 'react'
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
]

export function HashtagGenerator() {
  const [topic, setTopic] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const generateHashtags = () => {
    if (!topic && selectedCategories.length === 0) {
      setToastMessage('Please enter a topic or select categories')
      setToastType('error')
      setShowToast(true)
      return
    }

    // Collect hashtags from selected categories
    const categoryHashtags = TRENDING_HASHTAGS
      .filter(group => selectedCategories.includes(group.category))
      .flatMap(group => group.hashtags)

    // Generate topic-specific hashtags
    const topicHashtags = topic
      ? [
          `#${topic.toLowerCase().replace(/\s+/g, '')}`,
          `#${topic.toLowerCase().replace(/\s+/g, '')}photography`,
          `#${topic.toLowerCase().replace(/\s+/g, '')}life`,
          `#${topic.toLowerCase().replace(/\s+/g, '')}lover`,
          `#${topic.toLowerCase().replace(/\s+/g, '')}gram`,
        ]
      : []

    // Combine and remove duplicates
    const hashtagSet = new Set([...categoryHashtags.map(h => `#${h}`), ...topicHashtags])
    const allHashtags = Array.from(hashtagSet)

    setGeneratedHashtags(allHashtags)
    setSelectedHashtags([])
    setToastMessage('Hashtags generated successfully!')
    setToastType('success')
    setShowToast(true)
  }

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    )
  }

  const copyToClipboard = () => {
    const textToCopy = selectedHashtags.length > 0
      ? selectedHashtags.join(' ')
      : generatedHashtags.join(' ')

    navigator.clipboard.writeText(textToCopy).then(() => {
      setToastMessage('Hashtags copied to clipboard!')
      setToastType('success')
      setShowToast(true)
    })
  }

  const handleReset = () => {
    setTopic('')
    setSelectedCategories([])
    setGeneratedHashtags([])
    setSelectedHashtags([])
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter Your Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., sunset, coffee, travel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Categories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2"
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
          </div>

          <div className="flex gap-4">
            <button
              onClick={generateHashtags}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Hashtags
            </button>

            <button
              onClick={handleReset}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Reset
            </button>
          </div>
        </div>

        {generatedHashtags.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Hashtags</h3>
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Copy {selectedHashtags.length > 0 ? 'Selected' : 'All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedHashtags.map((hashtag) => (
                  <button
                    key={hashtag}
                    onClick={() => toggleHashtag(hashtag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedHashtags.includes(hashtag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hashtag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use 20-30 relevant hashtags per post</li>
                <li>• Mix popular and niche hashtags</li>
                <li>• Update your hashtags regularly</li>
                <li>• Avoid banned or spammy hashtags</li>
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