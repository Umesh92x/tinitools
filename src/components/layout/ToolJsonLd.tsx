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
    // Safety check: ensure we're on client and have required values
    if (!url || typeof window === 'undefined' || !document || !document.head) {
      return
    }

    // Small delay to ensure DOM is ready (especially on mobile)
    const timeoutId = setTimeout(() => {
      try {
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
        
        if (document.head) {
          document.head.appendChild(script)
        }
      } catch (error) {
        // Silently fail - don't break the app if JSON-LD injection fails
        console.warn('Failed to inject JSON-LD:', error)
      }
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      try {
        const scriptId = `json-ld-${toolName.replace(/\s+/g, '-').toLowerCase()}`
        const scriptToRemove = document.getElementById(scriptId)
        if (scriptToRemove) {
          scriptToRemove.remove()
        }
      } catch (error) {
        // Silently fail on cleanup
      }
    }
  }, [toolName, description, category, url, applicationCategory])

  return null
}

