import { Metadata } from 'next'
import config from './config'

interface GenerateMetadataProps {
  title: string
  description: string
  path: string
  keywords?: string[]
  imageUrl?: string
}

export function generateMetadata({
  title,
  description,
  path,
  keywords = [],
  imageUrl = '/og-image.jpg',
}: GenerateMetadataProps): Metadata {
  const url = `${config.siteUrl}${path}`

  return {
    title: {
      default: `${title} | TiniTools`,
      template: `%s | TiniTools - Free Online Tools`,
    },
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
      canonical: url,
    },
  }
} 