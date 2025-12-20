import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <p className="text-gray-600">
              TiniTools provides free online utilities for everyday use. Privacy-focused, reliable tools that just work.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/text/case-converter" className="text-gray-600 hover:text-indigo-600">
                  Case Converter
                </Link>
              </li>
              <li>
                <Link href="/text/password" className="text-gray-600 hover:text-indigo-600">
                  Password Generator
                </Link>
              </li>
              <li>
                <Link href="/text/markdown" className="text-gray-600 hover:text-indigo-600">
                  Markdown Preview
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/text" className="text-gray-600 hover:text-indigo-600">
                  Text Tools
                </Link>
              </li>
              <li>
                <Link href="/image" className="text-gray-600 hover:text-indigo-600">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/dev" className="text-gray-600 hover:text-indigo-600">
                  Developer Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-indigo-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-indigo-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} TiniTools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 