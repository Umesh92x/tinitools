'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import config from './config'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX' // Replace with your GA ID

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, any>
    ) => void
    dataLayer: any[]
  }
}

function AnalyticsContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null)

  useEffect(() => {
    // Check for existing cookie consent
    const consent = localStorage.getItem('cookie-consent')
    setCookieConsent(consent === 'true')
  }, [])

  useEffect(() => {
    if (pathname && cookieConsent === true) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname + searchParams.toString(),
        cookie_flags: 'SameSite=None;Secure',
        anonymize_ip: true,
        client_storage: 'none',
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      })
    }
  }, [pathname, searchParams, cookieConsent])

  const handleCookieConsent = (accepted: boolean) => {
    setCookieConsent(accepted)
    localStorage.setItem('cookie-consent', String(accepted))
  }

  if (cookieConsent === null) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-lg z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-700">
            We use cookies to analyze site traffic. Choose whether to accept cookies.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleCookieConsent(true)}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Accept
            </button>
            <button
              onClick={() => handleCookieConsent(false)}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!cookieConsent) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true,
              client_storage: 'none',
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `,
        }}
      />
    </>
  )
}

export function Analytics() {
  if (!config.isProd || !config.gaId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${config.gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.gaId}', {
              page_path: window.location.pathname,
              debug_mode: false
            });
          `,
        }}
      />
    </>
  );
}

// Analytics event tracking helper
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}; 