interface Config {
  siteUrl: string;
  gaId?: string;
  isDev: boolean;
  isProd: boolean;
}

// Get site URL with fallbacks
function getSiteUrl(): string {
  // First, try environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // On client side, try to get from window.location
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}`;
  }
  
  // Fallback for server-side during build
  return 'https://tinitools.com';
}

export const config: Config = {
  siteUrl: getSiteUrl(),
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
}

// Only validate on server-side during build (not on client)
if (typeof window === 'undefined' && config.isProd && !process.env.NEXT_PUBLIC_SITE_URL) {
  // Warn but don't throw - use fallback instead
  console.warn('Warning: NEXT_PUBLIC_SITE_URL not set. Using fallback URL.');
}

export default config; 