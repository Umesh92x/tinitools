'use client';

import { SearchParamsProvider } from '@/components/providers/SearchParamsProvider';
import { AdUnit } from '@/components/ads/AdUnit';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 p-6 sm:p-8">
          <SearchParamsProvider>
            {children}
          </SearchParamsProvider>
        </div>
        <div className="mt-12">
          <AdUnit type="in-article" />
        </div>
      </div>
    </div>
  );
} 