import { Metadata } from 'next'
import { generateMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const metadata: Metadata = generateMetadata({
  title: 'About TiniTools',
  description: 'Learn about TiniTools - Free online utilities and tools to make your life simpler. Privacy-focused, reliable tools that just work.',
  path: '/about',
  keywords: ['about tinitools', 'free online tools', 'utility tools', 'online converters'],
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About TiniTools</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              TiniTools is a collection of free, online utilities designed to make your daily tasks simpler and more efficient. 
              We believe that powerful tools should be accessible to everyone, without the need for sign-ups, subscriptions, or hidden costs.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Our mission is to provide high-quality, free online tools that help people solve problems quickly and efficiently. 
              Whether you're a developer, student, professional, or just someone looking to simplify everyday tasks, TiniTools has something for you.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>200+ Free Tools</strong> - A comprehensive collection of utilities across multiple categories</li>
              <li><strong>No Sign-Up Required</strong> - Use our tools instantly without creating an account</li>
              <li><strong>Privacy-Focused</strong> - Your data stays on your device. We don't track or store your information</li>
              <li><strong>100% Free</strong> - All tools are completely free with no hidden costs</li>
              <li><strong>Fast & Reliable</strong> - Tools that work quickly and efficiently</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Categories</h2>
            <p className="text-gray-600 mb-4">
              We offer tools across various categories:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Text & Writing Tools</h3>
                <p className="text-sm text-gray-600">Case converters, text formatters, password generators, and more</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">PDF Tools</h3>
                <p className="text-sm text-gray-600">Merge, split, convert, and edit PDF files</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Image Tools</h3>
                <p className="text-sm text-gray-600">Resize, convert, and edit images</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Data Tools</h3>
                <p className="text-sm text-gray-600">Convert and validate JSON, CSV, XML, YAML, and more</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Productivity Tools</h3>
                <p className="text-sm text-gray-600">Todo lists, note-taking, habit tracking, and time management</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Financial Tools</h3>
                <p className="text-sm text-gray-600">EMI calculators, currency converters, tax calculators, and more</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy & Security</h2>
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. All processing happens in your browser - we don't send your data to our servers. 
              Files and data you upload are processed locally and never stored or transmitted to us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-4">
              Have a question, suggestion, or feedback? We'd love to hear from you!
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

