export default function Loading() {
  return (
    <div className="animate-pulse space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
} 