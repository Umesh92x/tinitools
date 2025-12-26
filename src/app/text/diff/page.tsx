import { TextDiffChecker } from '@/components/tools/text/TextDiffChecker'
import { generateMetadata } from '@/lib/metadata'
import { SearchParamsProvider } from '@/components/providers/SearchParamsProvider'
import { AdUnit } from '@/components/ads/AdUnit'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { RelatedTools } from '@/components/shared/RelatedTools'
import { ToolJsonLd } from '@/components/layout/ToolJsonLd'

export const metadata = generateMetadata({
  title: 'Text Diff Checker',
  description: 'Free text diff checker - Compare two texts and highlight differences instantly. Perfect for finding changes between versions. No signup required.',
  path: '/text/diff',
  keywords: ['text diff', 'text compare', 'diff checker', 'text difference', 'text comparison'],
})

export default function TextDiffPage() {
  const relatedTools = [
    { name: 'Case Converter', href: '/text/case-converter' },
    { name: 'Text Statistics', href: '/text/statistics' },
    { name: 'Line Break Remover', href: '/text/line-breaks' },
    { name: 'Markdown Preview', href: '/text/markdown' },
  ]

  return (
    <>
      <ToolJsonLd
        toolName="Text Diff Checker"
        description="Free text diff checker - Compare two texts and highlight differences instantly. Perfect for finding changes between versions. No signup required."
        category="Text & Writing Tools"
        url="/text/diff"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: 'Text & Writing Tools', href: '/text' },
            { label: 'Text Diff Checker' },
          ]} />
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Text Diff Checker
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Free text diff checker - Compare two texts and highlight differences instantly. Perfect for finding changes between versions. No signup required.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6 sm:p-8">
            <SearchParamsProvider>
              <TextDiffChecker />
            </SearchParamsProvider>
          </div>
          <RelatedTools tools={relatedTools} currentTool="/text/diff" />
          <div className="mt-12">
            <AdUnit type="in-article" />
          </div>
        </div>
      </div>
    </>
  )
} 