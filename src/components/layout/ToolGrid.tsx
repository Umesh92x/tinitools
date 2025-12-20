import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface Tool {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

interface ToolGridProps {
  tools: Tool[]
}

export function ToolGrid({ tools }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="block group"
        >
          <div className="relative h-full bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <tool.icon className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                {tool.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              {tool.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
} 