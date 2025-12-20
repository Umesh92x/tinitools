import { MetadataRoute } from 'next'

const baseUrl = 'https://tinitools.com' // Replace with your actual domain

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
        'markdown'
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
    { category: 'image', tools: ['resizer', 'base64', 'color-picker'] },
    { category: 'datetime', tools: ['calculator', 'countdown', 'epoch'] },
    { category: 'dev', tools: ['json', 'minify', 'meta-tags'] },
    { category: 'math', tools: ['percentage', 'emi', 'gst'] },
    { category: 'social', tools: ['hashtags', 'counter', 'caption'] },
    { category: 'pdf', tools: ['to-image', 'merge', 'from-text'] },
    { category: 'misc', tools: ['random', 'coin-flip', 'pomodoro'] },
    { category: 'educational', tools: ['multiplication-table', 'periodic-table', 'math-formulas', 'calculator'] },
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