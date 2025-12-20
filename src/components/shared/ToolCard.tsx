import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon: string
}

export function ToolCard({ title, description, href, icon }: ToolCardProps) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
} 