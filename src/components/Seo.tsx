import { Metadata } from 'next'

interface SeoProps {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage = '/og-image.jpg',
  noIndex = false,
}: SeoProps): Metadata {
  return {
    title: `${title} - TiniTools`,
    description,
    keywords: [
      'online tools',
      'web utilities',
      'free tools',
      ...keywords,
    ],
    openGraph: {
      title: `${title} - TiniTools`,
      description,
      images: [ogImage],
      type: 'website',
      siteName: 'TiniTools',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - TiniTools`,
      description,
      images: [ogImage],
    },
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
  }
} 