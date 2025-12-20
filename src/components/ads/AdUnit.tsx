'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { CSSProperties } from 'react'

interface AdUnitProps {
  type: 'banner' | 'sidebar' | 'in-article'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdUnit({ type, className = '' }: AdUnitProps) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (err) {
      console.error('Ad push error:', err)
    }
  }, [])

  const adSlots = {
    banner: {
      style: {
        display: 'block',
        textAlign: 'center',
      } as CSSProperties,
      'data-ad-client': 'ca-pub-XXXXXXXXXXXXXXXX',
      'data-ad-slot': 'XXXXXXXXXX',
      'data-ad-format': 'auto',
      'data-full-width-responsive': 'true',
    },
    sidebar: {
      style: {
        display: 'block',
      } as CSSProperties,
      'data-ad-client': 'ca-pub-XXXXXXXXXXXXXXXX',
      'data-ad-slot': 'XXXXXXXXXX',
      'data-ad-format': 'vertical',
    },
    'in-article': {
      style: {
        display: 'block',
        textAlign: 'center',
      } as CSSProperties,
      'data-ad-client': 'ca-pub-XXXXXXXXXXXXXXXX',
      'data-ad-slot': 'XXXXXXXXXX',
      'data-ad-format': 'fluid',
      'data-ad-layout': 'in-article',
    },
  }

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <div className={`ad-container ${className}`}>
        <ins
          className="adsbygoogle"
          {...adSlots[type]}
        />
      </div>
    </>
  )
} 