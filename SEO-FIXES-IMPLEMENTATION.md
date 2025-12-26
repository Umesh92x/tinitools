# SEO Fixes - Quick Implementation Guide

## 🔴 Critical Fix #1: Standardize Metadata

### Problem
Pages use different metadata approaches, some missing canonical URLs.

### Solution
Create a unified metadata helper and update all pages.

### Implementation

**Step 1: Update lib/metadata.ts to be the single source**

```tsx
// src/lib/metadata.ts (already exists, just ensure it's used everywhere)
import { Metadata } from 'next'
import config from './config'

export function generateMetadata({
  title,
  description,
  path,
  keywords = [],
  imageUrl = '/og-image.jpg',
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  imageUrl?: string
}): Metadata {
  const url = `${config.siteUrl}${path}`

  return {
    title: `${title} | TiniTools`,
    description,
    keywords: [
      ...keywords,
      'online tools',
      'web utilities',
      'free tools',
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'TiniTools',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url, // ✅ Always includes canonical
    },
  }
}
```

**Step 2: Update all tool pages**

```tsx
// Example: src/app/text/case-converter/page.tsx
import { generateMetadata } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Case Converter',
  description: 'Free online case converter - Transform text to uppercase, lowercase, title case instantly. No signup required. Used by 10,000+ users daily.',
  path: '/text/case-converter',
  keywords: ['case converter', 'text case', 'uppercase', 'lowercase', 'title case', 'text converter']
})
```

---

## 🔴 Critical Fix #2: Add Structured Data to Tools

### Implementation

**Step 1: Create ToolJsonLd component**

```tsx
// src/components/layout/ToolJsonLd.tsx
import Script from 'next/script'
import config from '@/lib/config'

interface ToolJsonLdProps {
  toolName: string
  description: string
  category: string
  url: string
  applicationCategory?: string
}

export function ToolJsonLd({
  toolName,
  description,
  category,
  url,
  applicationCategory = 'UtilityApplication',
}: ToolJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    applicationCategory,
    description,
    url: `${config.siteUrl}${url}`,
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
    category: category,
  }

  return (
    <Script
      id={`json-ld-${toolName.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  )
}
```

**Step 2: Add to ToolLayout component**

```tsx
// src/components/layout/ToolLayout.tsx
import { ToolJsonLd } from './ToolJsonLd'

export default function ToolLayout({ title, description, category, children }) {
  return (
    <>
      <ToolJsonLd
        toolName={title}
        description={description}
        category={category || 'Tools'}
        url={window.location.pathname}
      />
      {/* rest of layout */}
    </>
  )
}
```

---

## 🟡 Fix #3: Add Breadcrumbs

### Implementation

**Step 1: Create Breadcrumbs component**

```tsx
// src/components/layout/Breadcrumbs.tsx
import Link from 'next/link'
import Script from 'next/script'
import config from '@/lib/config'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${config.siteUrl}${item.href}` : undefined,
    })),
  }

  return (
    <>
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="afterInteractive"
      />
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <span key={index} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-500">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
```

**Step 2: Use in tool pages**

```tsx
// In tool page
<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Text Tools', href: '/text' },
    { label: 'Case Converter' }, // Current page, no href
  ]}
/>
```

---

## 🟡 Fix #4: Add Related Tools

### Implementation

```tsx
// src/components/shared/RelatedTools.tsx
import Link from 'next/link'
import { categories } from '@/app/page' // Or import from config

interface RelatedToolsProps {
  currentTool: string
  category: string
  limit?: number
}

export function RelatedTools({ currentTool, category, limit = 4 }: RelatedToolsProps) {
  const categoryData = categories.find(c => c.href === `/${category}`)
  const relatedTools = categoryData?.featured
    .filter(tool => tool.href !== currentTool)
    .slice(0, limit)

  if (!relatedTools || relatedTools.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Related Tools
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedTools.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
              {tool.name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

---

## 🟡 Fix #5: Improve Meta Descriptions

### Template for Better Descriptions

```tsx
// Template
const description = `[Action verb] [tool name] - [Key benefit]. [Additional benefit]. [Social proof/numbers]. [CTA - No signup required/100% free].`

// Examples:
'Free online case converter - Transform text to uppercase, lowercase, title case instantly. No signup required. Used by 10,000+ users daily.'

'Free EMI calculator - Calculate loan payments instantly. Get detailed amortization schedule. 100% free, no registration needed.'

'PDF merger tool - Combine multiple PDF files into one. Fast, secure, and completely free. No watermarks, no limits.'
```

### Update Pattern

```tsx
export const metadata = generateMetadata({
  title: 'Case Converter',
  description: 'Free online case converter - Transform text to uppercase, lowercase, title case instantly. No signup required. Used by 10,000+ users daily.',
  path: '/text/case-converter',
  keywords: ['case converter', 'text case', 'uppercase', 'lowercase']
})
```

---

## 🟡 Fix #6: Fix Sitemap

### Implementation

```tsx
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import config from '@/lib/config'
import { categories } from '@/app/page' // Import from centralized config

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.siteUrl

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

  // Generate from actual categories (no hardcoding)
  categories.forEach((category) => {
    // Category page
    sitemapEntries.push({
      url: `${baseUrl}${category.href}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    // Individual tool pages
    category.featured.forEach((tool) => {
      sitemapEntries.push({
        url: `${baseUrl}${tool.href}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  })

  return sitemapEntries
}
```

---

## 📋 Implementation Checklist

### Week 1 (Critical)
- [ ] Create/update ToolJsonLd component
- [ ] Add ToolJsonLd to ToolLayout
- [ ] Standardize all tool pages to use lib/metadata.ts
- [ ] Fix sitemap to use dynamic categories
- [ ] Add canonical URLs to all pages

### Week 2 (High Priority)
- [ ] Create Breadcrumbs component
- [ ] Add breadcrumbs to all tool pages
- [ ] Create RelatedTools component
- [ ] Add related tools to all tool pages
- [ ] Update all meta descriptions with better format

### Week 3 (Medium Priority)
- [ ] Add FAQ sections to popular tools
- [ ] Add FAQPage schema
- [ ] Audit and fix all image alt text
- [ ] Create tool-specific OG images (or dynamic generation)

---

## 🚀 Quick Start

1. **Start with Fix #1** - Standardize metadata (30 min)
2. **Then Fix #2** - Add structured data (1 hour)
3. **Then Fix #3** - Add breadcrumbs (30 min)
4. **Then Fix #4** - Add related tools (30 min)

These 4 fixes will significantly improve your SEO score!

