import Script from 'next/script';

export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TiniTools',
    description: 'Your one-stop collection of free online utilities. Simple, fast, and free tools for everyday use.',
    url: 'https://tinitools.com',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'TiniTools',
      url: 'https://tinitools.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
    },
    sameAs: [
      'https://twitter.com/tinitools',
      // Add other social media links when available
    ],
  };

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="worker"
    />
  );
} 