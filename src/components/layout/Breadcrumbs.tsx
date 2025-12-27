'use client'

import Link from 'next/link'
import config from '@/lib/config'
import { useEffect } from 'react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  useEffect(() => {
    // Safety check: ensure we're on client and have required values
    if (typeof window === 'undefined' || !document || !document.head) {
      return
    }

    // Small delay to ensure DOM is ready (especially on mobile)
    const timeoutId = setTimeout(() => {
      try {
        const scriptId = 'breadcrumb-json-ld'
        
        // Remove existing script if it exists
        const existingScript = document.getElementById(scriptId)
        if (existingScript) {
          existingScript.remove()
        }

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

        const script = document.createElement('script')
        script.id = scriptId
        script.type = 'application/ld+json'
        script.text = JSON.stringify(jsonLd)
        
        if (document.head) {
          document.head.appendChild(script)
        }
      } catch (error) {
        // Silently fail - don't break the app if JSON-LD injection fails
        console.warn('Failed to inject breadcrumb JSON-LD:', error)
      }
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      try {
        const scriptToRemove = document.getElementById('breadcrumb-json-ld')
        if (scriptToRemove) {
          scriptToRemove.remove()
        }
      } catch (error) {
        // Silently fail on cleanup
      }
    }
  }, [items])

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
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
            <span className="text-gray-500 dark:text-gray-500 font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
        </span>
      ))}
    </nav>
  )
}

