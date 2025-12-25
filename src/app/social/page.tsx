import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import { ToolGrid } from '@/components/layout/ToolGrid'
import { 
  Hash,
  Share2,
  Link,
  MessageSquare,
  AtSign,
  QrCode,
  Sparkles
} from 'lucide-react'

export const metadata: Metadata = generateMetadata({
  title: 'Social Media Tools',
  description: 'Free online tools for social media content creation and management',
  path: '/social',
  keywords: ['social media tools', 'hashtag generator', 'link shortener', 'social media content'],
})

export default function SocialTools() {
const tools = [
  {
      title: 'Hashtag Generator',
      description: 'Generate relevant hashtags for your social media posts.',
      href: '/social/hashtags',
      icon: Hash,
    },
    {
      title: 'Social Share Generator',
      description: 'Create social media share buttons and links.',
      href: '/social/share-generator',
      icon: Share2,
  },
  {
      title: 'Link Shortener',
      description: 'Shorten long URLs for social media sharing.',
      href: '/social/link-shortener',
      icon: Link,
    },
    {
      title: 'Bio Generator',
      description: 'Create engaging social media bios and descriptions.',
      href: '/social/bio-generator',
      icon: MessageSquare,
  },
  {
      title: 'Username Generator',
      description: 'Generate unique usernames for social media accounts.',
      href: '/social/username-generator',
      icon: AtSign,
    },
    {
      title: 'QR Code Generator',
      description: 'Create QR codes for social media profiles and links.',
      href: '/social/qr-code',
      icon: QrCode,
    },
    {
      title: 'Caption Generator',
      description: 'Generate creative captions for your social media posts.',
      href: '/social/caption',
      icon: Sparkles,
    },
  ]

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
          Social Media Tools
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          Free online tools for social media content creation and management
        </p>
      </div>

      <ToolGrid tools={tools} />
    </div>
  )
} 