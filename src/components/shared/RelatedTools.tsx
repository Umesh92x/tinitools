'use client'

import Link from 'next/link'

interface Tool {
  name: string
  href: string
}

interface RelatedToolsProps {
  tools: Tool[]
  currentTool: string
}

export function RelatedTools({ tools, currentTool }: RelatedToolsProps) {
  const relatedTools = tools
    .filter(tool => tool.href !== currentTool)
    .slice(0, 4)

  if (!relatedTools || relatedTools.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Related Tools
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedTools.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {tool.name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  )
}

