'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { SocialShare } from '@/components/layout/SocialShare'
import {
  TextIcon,
  HeartPulseIcon,
  WalletIcon,
  ImageIcon,
  ClockIcon,
  CodeIcon,
  CalculatorIcon,
  ShareIcon,
  FileTextIcon,
  WrenchIcon,
  GraduationCapIcon,
  ListTodoIcon,
} from 'lucide-react'

const categories = [
  { 
    name: 'Text & Writing Tools', 
    href: '/text',
    icon: TextIcon,
    description: 'Text manipulation and formatting tools'
  },
  { 
    name: 'Health & Fitness', 
    href: '/health-fitness',
    icon: HeartPulseIcon,
    description: 'Health and fitness calculators and trackers'
  },
  { 
    name: 'Financial Tools', 
    href: '/financial',
    icon: WalletIcon,
    description: 'Financial calculators and converters'
  },
  { 
    name: 'Image Tools', 
    href: '/image',
    icon: ImageIcon,
    description: 'Image processing and conversion tools'
  },
  { 
    name: 'Date & Time', 
    href: '/datetime',
    icon: ClockIcon,
    description: 'Date and time utilities'
  },
  { 
    name: 'Developer Tools', 
    href: '/dev',
    icon: CodeIcon,
    description: 'Tools for developers'
  },
  { 
    name: 'Math & Calculations', 
    href: '/math',
    icon: CalculatorIcon,
    description: 'Mathematical calculators and converters'
  },
  { 
    name: 'Social Tools', 
    href: '/social',
    icon: ShareIcon,
    description: 'Social media utilities'
  },
  { 
    name: 'PDF Tools', 
    href: '/pdf',
    icon: FileTextIcon,
    description: 'PDF manipulation tools'
  },
  { 
    name: 'Misc Tools', 
    href: '/misc',
    icon: WrenchIcon,
    description: 'Miscellaneous utilities'
  },
  { 
    name: 'Educational Tools', 
    href: '/educational',
    icon: GraduationCapIcon,
    description: 'Educational resources and calculators'
  },
  { 
    name: 'Productivity Tools', 
    href: '/productivity',
    icon: ListTodoIcon,
    description: 'Productivity enhancing tools'
  }
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname?.startsWith(href)
  }

  return (
    <header className="relative z-50">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[95%] mx-auto">
          <div className="relative flex items-center justify-between h-16 px-2 sm:px-4">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                href="/" 
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Image
                  src="/TiniToolsBest.png"
                  alt="TiniTools Logo"
                  width={200}
                  height={100}
                  style={{ height: '60px', width: 'auto' }}
                  className="object-contain"
                  priority
                  unoptimized={false}
                />
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:block flex-1 ml-6 overflow-x-auto no-scrollbar">
              <div className="flex space-x-2 py-2">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 transition-colors ${
                      isActive(category.href)
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={category.description}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side buttons - Share, Theme Toggle, and Mobile menu */}
            <div className="flex items-center gap-2">
              {/* Share and Theme Toggle - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <SocialShare className="[&_button]:rounded-full [&_button]:w-10 [&_button]:h-10 [&_button]:p-0 [&_button]:flex [&_button]:items-center [&_button]:justify-center" />
                </div>
                <div className="[&_button]:rounded-full [&_button]:w-10 [&_button]:h-10 [&_button]:p-0">
                  <ThemeToggle />
                </div>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Share and Theme Toggle */}
              <div className="flex items-center justify-end gap-2 px-3 py-2 mb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <SocialShare className="[&_button]:rounded-full [&_button]:w-10 [&_button]:h-10 [&_button]:p-0 [&_button]:flex [&_button]:items-center [&_button]:justify-center" />
                </div>
                <div className="[&_button]:rounded-full [&_button]:w-10 [&_button]:h-10 [&_button]:p-0">
                  <ThemeToggle />
                </div>
              </div>
              
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(category.href)
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <category.icon className="w-5 h-5" />
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 