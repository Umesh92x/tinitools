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

