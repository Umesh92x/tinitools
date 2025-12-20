import Link from 'next/link'
import { type ForwardRefExoticComponent, type SVGProps, type RefAttributes } from 'react'

interface Tool {
  name: string
  description: string
  href: string
  icon: ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & RefAttributes<SVGSVGElement>>
}

interface CategoryLayoutProps {
  title: string
  description: string
  tools: Tool[]
}

export default function CategoryLayout({ title, description, tools }: CategoryLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        <p className="mt-4 text-xl text-gray-600">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block group"
          >
            <div className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-x-3">
                <tool.icon className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                  {tool.name}
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 