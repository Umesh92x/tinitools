import { MetadataRoute } from 'next'
import config from '@/lib/config'

const baseUrl = config.siteUrl

export default function sitemap(): MetadataRoute.Sitemap {
  // Get all tool categories and their tools
  const tools = [
    { 
      category: 'text', 
      tools: [
        'case-converter', 
        'line-breaks', 
        'text-to-speech',
        'lorem-ipsum',
        'statistics',
        'password',
        'diff',
        'markdown',
        'phonetic-typing'
      ] 
    },
    { 
      category: 'health-fitness', 
      tools: [
        'calorie-calculator',
        'water-intake',
        'rep-counter',
        'sleep-calculator',
        'heart-rate'
      ] 
    },
    { category: 'image', tools: ['resizer', 'base64', 'color-picker', 'favicon'] },
    { category: 'datetime', tools: ['calculator', 'countdown', 'epoch'] },
    { category: 'dev', tools: ['json', 'minify', 'meta-tags'] },
    { category: 'math', tools: ['percentage', 'emi', 'gst'] },
    { category: 'social', tools: ['hashtags', 'counter', 'caption'] },
    { category: 'pdf', tools: ['to-image', 'merge', 'from-text', 'split', 'rotate', 'delete-pages', 'sign'] },
    { category: 'misc', tools: ['random', 'coin-flip', 'pomodoro', 'dice', 'stopwatch', 'countdown'] },
    { category: 'data', tools: ['csv-to-json', 'json-to-csv', 'json-formatter', 'xml-formatter', 'yaml-validator', 'base64'] },
    { category: 'file', tools: ['hash', 'qr-code', 'size-converter', 'type-detector', 'metadata', 'duplicate-checker', 'name-formatter'] },
    { category: 'productivity', tools: ['notes', 'todo', 'habits', 'reading-time', 'typing-speed', 'time-tracker', 'goal-tracker'] },
    { category: 'educational', tools: ['multiplication-table', 'periodic-table', 'math-formulas', 'calculator', 'grade-calculator', 'gpa-calculator', 'flashcards'] },
  ]

  // Get all blog posts
  const posts = [
    'text-case-guide',
    'image-optimization-guide',
    'unix-timestamp-guide',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Add tool pages
  tools.forEach(({ category, tools }) => {
    // Add category page
    sitemapEntries.push({
      url: `${baseUrl}/${category}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    // Add individual tool pages
    tools.forEach((tool) => {
      sitemapEntries.push({
        url: `${baseUrl}/${category}/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  })

  // Add blog posts
  posts.forEach((post) => {
    sitemapEntries.push({
      url: `${baseUrl}/blog/${post}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  return sitemapEntries
} 