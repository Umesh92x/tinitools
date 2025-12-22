import { TextDiffChecker } from '@/components/tools/text/TextDiffChecker'
import { generateMetadata } from '@/components/Seo'
import { SearchParamsProvider } from '@/components/providers/SearchParamsProvider'
import { AdUnit } from '@/components/ads/AdUnit'

export const metadata = generateMetadata({
  title: 'Text Diff Checker',
  description: 'Compare two texts and highlight the differences. Perfect for finding changes between versions.',
  keywords: ['text diff', 'text compare', 'diff checker', 'text difference', 'text comparison'],
})

export default function TextDiffPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Text Diff Checker
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Compare two texts and highlight the differences. Perfect for finding changes between versions.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6 sm:p-8">
          <SearchParamsProvider>
            <TextDiffChecker />
          </SearchParamsProvider>
        </div>
        <div className="mt-12">
          <AdUnit type="in-article" />
        </div>
      </div>
    </div>
  )
} 