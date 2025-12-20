import Link from 'next/link'
import { generateMetadata } from '@/components/Seo'

export const metadata = generateMetadata({
  title: 'Blog',
  description: 'Tips, tutorials, and insights about online tools and productivity.',
  keywords: ['blog', 'tutorials', 'productivity tips', 'online tools guide'],
})

const posts = [
  {
    title: 'How to Choose the Right Text Case for Your Content',
    description: 'Learn when to use different text cases and how they impact readability and SEO.',
    slug: 'text-case-guide',
    date: '2024-03-20',
    category: 'Text Tools',
  },
  {
    title: 'Image Optimization Guide for Web Performance',
    description: 'Best practices for optimizing images without compromising quality.',
    slug: 'image-optimization-guide',
    date: '2024-03-18',
    category: 'Image Tools',
  },
  {
    title: 'Understanding Unix Timestamps and Epoch Time',
    description: 'A comprehensive guide to working with timestamps and time conversions.',
    slug: 'unix-timestamp-guide',
    date: '2024-03-15',
    category: 'Developer Tools',
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
        <p className="mt-4 text-lg text-gray-600">
          Tips, tutorials, and insights about online tools and productivity
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-x-4 text-xs">
              <time dateTime={post.date} className="text-gray-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                {post.category}
              </span>
            </div>
            <div className="group relative">
              <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900">
                <Link href={`/blog/${post.slug}`}>
                  <span className="absolute inset-0" />
                  {post.title}
                </Link>
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                {post.description}
              </p>
            </div>
            <div className="mt-4">
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Read more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 