interface Config {
  siteUrl: string;
  gaId?: string;
  isDev: boolean;
  isProd: boolean;
}

export const config: Config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
}

// Validate required environment variables in production
if (config.isProd) {
  const required = ['NEXT_PUBLIC_SITE_URL'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

export default config; 