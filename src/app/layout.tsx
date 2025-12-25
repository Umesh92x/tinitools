import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@/lib/analytics";
import Script from 'next/script';
import { Suspense } from 'react';
import JsonLd from "@/components/layout/JsonLd";
import config from "@/lib/config";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "TiniTools - Free Online Utilities & Tools Collection",
    template: "%s | TiniTools - Free Online Tools",
  },
  description: "Discover TiniTools - Your one-stop collection of free online utilities. Text tools, converters, calculators, image editors, and more. Simple, fast, and free tools for everyday use.",
  keywords: [
    "online tools",
    "web utilities",
    "free tools",
    "text tools",
    "image tools",
    "developer tools",
    "file converter",
    "calculator",
    "productivity tools",
    "online converter",
    "web tools",
    "utility tools",
    "free online utilities",
    "digital tools"
  ],
  authors: [{ name: 'TiniTools' }],
  creator: 'TiniTools',
  publisher: 'TiniTools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.siteUrl,
    siteName: "TiniTools",
    title: "TiniTools - Free Online Utilities & Tools Collection",
    description: "Your one-stop collection of free online utilities. Simple, fast, and free tools for everyday use.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TiniTools - Free Online Utilities",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tinitools",
    creator: "@tinitools",
    title: "TiniTools - Free Online Utilities",
    description: "Your one-stop collection of free online utilities. Simple, fast, and free tools for everyday use.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google18b5cdf715e1e72c',
    yandex: 'add-your-yandex-verification-here',
  },
  alternates: {
    canonical: config.siteUrl,
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <JsonLd />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider>
          <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-800 shadow-sm" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow w-full">
            <Suspense fallback={<div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-96 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />}>
              {children}
            </Suspense>
          </main>
          <Suspense fallback={<div className="h-24 bg-gray-50 dark:bg-gray-900" />}>
            <Footer />
          </Suspense>
          <Analytics />
        </ThemeProvider>
        <Script
          strategy="afterInteractive"
          id="layout-init"
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.style.scrollBehavior = 'smooth';
              document.documentElement.style.overflow = 'auto';
            `,
          }}
        />
      </body>
    </html>
  );
}
