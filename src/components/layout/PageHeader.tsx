interface PageHeaderProps {
  heading: string
  text?: string
}

export function PageHeader({ heading, text }: PageHeaderProps) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {heading}
      </h1>
      {text && (
        <p className="mt-4 text-lg text-gray-600">
          {text}
        </p>
      )}
    </div>
  )
} 