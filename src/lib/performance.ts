export function trackPageLoadPerformance() {
  if (typeof window === 'undefined') return

  // Wait for the page to fully load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      // Get First Paint and First Contentful Paint
      const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime
      const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime

      // Track performance metrics
      if (window.gtag) {
        window.gtag('event', 'performance_metrics', {
          event_category: 'Performance',
          event_label: window.location.pathname,
          dns_time: navigation.domainLookupEnd - navigation.domainLookupStart,
          connection_time: navigation.connectEnd - navigation.connectStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          dom_load_time: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          first_paint: firstPaint,
          first_contentful_paint: firstContentfulPaint,
          load_time: navigation.loadEventEnd - navigation.loadEventStart,
        })
      }
    }, 0)
  })
}

export function trackResourcePerformance() {
  if (typeof window === 'undefined') return

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry instanceof PerformanceResourceTiming && window.gtag) {
        window.gtag('event', 'resource_timing', {
          event_category: 'Performance',
          event_label: entry.name,
          resource_type: entry.initiatorType,
          duration: entry.duration,
          transfer_size: entry.transferSize,
        })
      }
    })
  })

  observer.observe({ entryTypes: ['resource'] })
} 