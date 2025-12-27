'use client'

import config from '@/lib/config'
import { useEffect } from 'react'

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
  useEffect(() => {
    if (!url || typeof window === 'undefined') return

    const scriptId = `json-ld-${toolName.replace(/\s+/g, '-').toLowerCase()}`
    
    // Remove existing script if it exists
    const existingScript = document.getElementById(scriptId)
    if (existingScript) {
      existingScript.remove()
    }

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

    const script = document.createElement('script')
    script.id = scriptId
    script.type = 'application/ld+json'
    script.text = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById(scriptId)
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [toolName, description, category, url, applicationCategory])

  return null
}

