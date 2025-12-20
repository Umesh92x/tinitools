'use client';

import { Suspense } from 'react';

interface SearchParamsProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SearchParamsProvider({ children, fallback }: SearchParamsProviderProps) {
  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-100 rounded-lg h-96" />}>
      {children}
    </Suspense>
  );
} 