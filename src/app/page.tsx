'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { FloatingIcons } from '@/components/layout/FloatingIcons'
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  ClockIcon, 
  CodeBracketIcon,
  CalculatorIcon,
  HashtagIcon,
  DocumentIcon,
  SparklesIcon,
  TableCellsIcon,
  FolderIcon,
  ClipboardIcon,
  AcademicCapIcon,
  HeartIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { ContactForm } from '@/components/layout/ContactForm'

const categories = [
  {
    name: 'Text & Writing Tools',
    description: 'Text manipulation, formatting, and writing utilities',
    href: '/text',
    icon: DocumentTextIcon,
    featured: [
      { name: 'Case Converter', href: '/text/case-converter' },
      { name: 'Line Break Remover', href: '/text/line-breaks' },
      { name: 'Text to Speech', href: '/text/text-to-speech' },
      { name: 'Password Generator', href: '/text/password' },
      { name: 'Lorem Ipsum Generator', href: '/text/lorem-ipsum' },
      { name: 'Text Statistics', href: '/text/statistics' },
      { name: 'Text Diff Checker', href: '/text/diff' },
      { name: 'Markdown Preview', href: '/text/markdown' },
      { name: 'Phonetic Typing', href: '/text/phonetic-typing' },
    ],
  },
  {
    name: 'Health & Fitness',
    description: 'Calculators and tools for health and fitness tracking',
    href: '/health-fitness',
    icon: HeartIcon,
    featured: [
      { name: 'Calorie Calculator', href: '/health-fitness/calorie-calculator' },
      { name: 'Water Intake Calculator', href: '/health-fitness/water-intake' },
      { name: 'Exercise Rep Counter', href: '/health-fitness/rep-counter' },
      { name: 'Sleep Time Calculator', href: '/health-fitness/sleep-calculator' },
      { name: 'Heart Rate Zone Calculator', href: '/health-fitness/heart-rate' },
    ],
  },
  {
    name: 'Financial Tools',
    description: 'Financial calculators and tools for money management',
    href: '/financial',
    icon: BanknotesIcon,
    featured: [
      { name: 'EMI Calculator', href: '/financial/emi' },
      { name: 'GST Calculator', href: '/financial/gst' },
      { name: 'Currency Converter', href: '/financial/currency' },
      { name: 'Investment Calculator', href: '/financial/investment' },
      { name: 'Compound Interest Calculator', href: '/financial/compound-interest' },
      { name: 'Tax Calculator', href: '/financial/tax' },
      { name: 'Split Bill Calculator', href: '/financial/split-bill' },
    ],
  },
  {
    name: 'Image Tools',
    description: 'Resize, convert, and edit images with ease',
    href: '/image',
    icon: PhotoIcon,
    featured: [
      { name: 'Image Resizer', href: '/image/resizer' },
      { name: 'Image to Base64', href: '/image/base64' },
      { name: 'Color Picker', href: '/image/color-picker' },
      { name: 'Favicon Generator', href: '/image/favicon' },
    ],
  },
  {
    name: 'Date & Time',
    description: 'Date calculators, timers, and converters',
    href: '/datetime',
    icon: ClockIcon,
    featured: [
      { name: 'World Clock', href: '/datetime/world-clock' },
      { name: 'Meeting Planner', href: '/datetime/meeting-planner' },
      { name: 'Date Calculator', href: '/datetime/calculator' },
      { name: 'Business Days', href: '/datetime/business-days' },
      { name: 'Calendar Generator', href: '/datetime/calendar' },
      { name: 'Countdown Timer', href: '/datetime/countdown' },
      { name: 'Epoch Converter', href: '/datetime/epoch' },
    ],
  },
  {
    name: 'Developer Tools',
    description: 'Essential tools for web developers',
    href: '/dev',
    icon: CodeBracketIcon,
    featured: [
      { name: 'JSON Formatter', href: '/dev/json' },
      { name: 'HTML Entity Converter', href: '/dev/html-entities' },
      { name: 'RegEx Tester', href: '/dev/regex' },
      { name: 'Cron Expression Generator', href: '/dev/cron' },
      { name: 'JWT Decoder', href: '/dev/jwt' },
      { name: 'UUID Generator', href: '/dev/uuid' },
    ],
  },
  {
    name: 'Math & Calculations',
    description: 'Calculators and converters for everyday calculations',
    href: '/math',
    icon: CalculatorIcon,
    featured: [
      { name: 'Calculator with History', href: '/math/calculator' },
      { name: 'Unit Converter', href: '/math/unit-converter' },
      { name: 'Percentage Calculator', href: '/math/percentage' },
      { name: 'BMI Calculator', href: '/math/bmi' },
      { name: 'Age Calculator', href: '/math/age' },
      { name: 'Tip Calculator', href: '/math/tip' },
    ],
  },
  {
    name: 'Social Media Tools',
    description: 'Tools for social media management',
    href: '/social',
    icon: HashtagIcon,
    featured: [
      { name: 'Hashtag Generator', href: '/social/hashtags' },
      { name: 'Caption Generator', href: '/social/caption' },
      { name: 'Social Share Generator', href: '/social/share-generator' },
      { name: 'Link Shortener', href: '/social/link-shortener' },
      { name: 'Bio Generator', href: '/social/bio-generator' },
      { name: 'Username Generator', href: '/social/username-generator' },
      { name: 'QR Code Generator', href: '/social/qr-code' },
    ],
  },
  {
    name: 'PDF Tools',
    description: 'Work with PDF files easily',
    href: '/pdf',
    icon: DocumentIcon,
    featured: [
      { name: 'PDF to Image', href: '/pdf/to-image' },
      { name: 'PDF Merger', href: '/pdf/merge' },
      { name: 'Text to PDF', href: '/pdf/from-text' },
      { name: 'PDF Splitter', href: '/pdf/split' },
      { name: 'PDF Rotate', href: '/pdf/rotate' },
      { name: 'PDF Page Delete', href: '/pdf/delete-pages' },
      { name: 'PDF Sign Tool', href: '/pdf/sign' },
    ],
  },
  {
    name: 'Misc Tools',
    description: 'Other useful utilities',
    href: '/misc',
    icon: SparklesIcon,
    featured: [
      { name: 'Random Number Generator', href: '/misc/random' },
      { name: 'Coin Flip', href: '/misc/coin-flip' },
      { name: 'Pomodoro Timer', href: '/misc/pomodoro' },
      { name: 'Dice Roller', href: '/misc/dice' },
      { name: 'Stopwatch', href: '/misc/stopwatch' },
      { name: 'Countdown Timer', href: '/misc/countdown' },
    ],
  },
  {
    name: 'Data Tools',
    description: 'Convert and validate different data formats',
    href: '/data',
    icon: TableCellsIcon,
    featured: [
      { name: 'CSV to JSON', href: '/data/csv-to-json' },
      { name: 'JSON to CSV', href: '/data/json-to-csv' },
      { name: 'JSON Formatter', href: '/data/json-formatter' },
      { name: 'XML Formatter', href: '/data/xml-formatter' },
      { name: 'YAML Validator', href: '/data/yaml-validator' },
      { name: 'Base64 Encoder/Decoder', href: '/data/base64' },
    ],
  },
  {
    name: 'File Tools',
    description: 'Tools for file operations and conversions',
    href: '/file',
    icon: FolderIcon,
    featured: [
      { name: 'File Hash Calculator', href: '/file/hash' },
      { name: 'QR Code Generator', href: '/file/qr-code' },
      { name: 'File Size Converter', href: '/file/size-converter' },
      { name: 'File Type Detector', href: '/file/type-detector' },
      { name: 'File Duplicate Checker', href: '/file/duplicate-checker' },
      { name: 'File Name Formatter', href: '/file/name-formatter' },
    ],
  },
  {
    name: 'Productivity Tools',
    description: 'Tools to boost your productivity and track your progress',
    href: '/productivity',
    icon: ClipboardIcon,
    featured: [
      { name: 'Note Taking', href: '/productivity/notes' },
      { name: 'Todo List', href: '/productivity/todo' },
      { name: 'Habit Tracker', href: '/productivity/habits' },
      { name: 'Reading Time Calculator', href: '/productivity/reading-time' },
      { name: 'Writing Speed Test', href: '/productivity/typing-speed' },
      { name: 'Time Tracker', href: '/productivity/time-tracker' },
      { name: 'Goal Tracker', href: '/productivity/goal-tracker' },
    ],
  },
  {
    name: 'Educational Tools',
    description: 'Tools for learning and teaching various subjects',
    href: '/educational',
    icon: AcademicCapIcon,
    featured: [
      { name: 'Multiplication Table Generator', href: '/educational/multiplication-table' },
      { name: 'Periodic Table Explorer', href: '/educational/periodic-table' },
      { name: 'Math Formula Sheet', href: '/educational/math-formulas' },
      { name: 'Scientific Calculator', href: '/educational/calculator' },
      { name: 'Grade Calculator', href: '/educational/grade-calculator' },
      { name: 'GPA Calculator', href: '/educational/gpa-calculator' },
      { name: 'Flashcard Generator', href: '/educational/flashcards' },
    ],
  },
]

// Popular/Featured tools with descriptions
const popularTools = [
  { 
    name: 'PDF Merger', 
    href: '/pdf/merge', 
    category: 'PDF Tools', 
    icon: DocumentIcon,
    description: 'Merge 2 or more PDF files into a single PDF file',
    badge: 'Featured'
  },
  { 
    name: 'Image Resizer', 
    href: '/image/resizer', 
    category: 'Image Tools', 
    icon: PhotoIcon,
    description: 'Resize your image dimensions',
    badge: 'Popular'
  },
  { 
    name: 'JSON Formatter', 
    href: '/data/json-formatter', 
    category: 'Data Tools', 
    icon: CodeBracketIcon,
    description: 'Format and validate JSON data',
    badge: 'Featured'
  },
  { 
    name: 'QR Code Generator', 
    href: '/file/qr-code', 
    category: 'File Tools', 
    icon: HashtagIcon,
    description: 'Generate QR codes for URLs, text, and more',
    badge: 'Popular'
  },
  { 
    name: 'Case Converter', 
    href: '/text/case-converter', 
    category: 'Text Tools', 
    icon: DocumentTextIcon,
    description: 'Convert text between different cases',
    badge: 'Popular'
  },
  { 
    name: 'Password Generator', 
    href: '/text/password', 
    category: 'Text Tools', 
    icon: SparklesIcon,
    description: 'Generate secure passwords instantly',
    badge: 'Featured'
  },
  { 
    name: 'EMI Calculator', 
    href: '/financial/emi', 
    category: 'Financial Tools', 
    icon: CalculatorIcon,
    description: 'Calculate your loan EMI easily',
    badge: 'Popular'
  },
  { 
    name: 'Todo List', 
    href: '/productivity/todo', 
    category: 'Productivity Tools', 
    icon: ClipboardIcon,
    description: 'Organize your tasks and boost productivity',
    badge: 'Featured'
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Start showing content after a brief delay
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  // Flatten all tools from all categories for search (deduplicated by href)
  const allTools = useMemo(() => {
    const toolsMap = new Map<string, { name: string; href: string; category: string; icon: any }>()
    
    // Add tools from categories
    categories.forEach((category) => {
      category.featured.forEach((tool) => {
        // Use href as unique key to prevent duplicates
        if (!toolsMap.has(tool.href)) {
          toolsMap.set(tool.href, {
            name: tool.name,
            href: tool.href,
            category: category.name,
            icon: category.icon,
          })
        }
      })
    })
    
    // Add popular tools (will skip if already exists)
    popularTools.forEach((tool) => {
      if (!toolsMap.has(tool.href)) {
        toolsMap.set(tool.href, {
          name: tool.name,
          href: tool.href,
          category: tool.category,
          icon: tool.icon,
        })
      }
    })
    
    return Array.from(toolsMap.values())
  }, [])

  // Filter and rank tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const query = searchQuery.toLowerCase().trim()
    
    const tools = allTools
      .filter((tool) => {
        const nameLower = tool.name.toLowerCase()
        
        // Only match based on tool name, not category
        // This ensures "password" only matches "Password Generator", not other tools
        // and "pdf" only matches tools with "pdf" in the name
        return nameLower.includes(query)
      })
      .map((tool) => {
        const nameLower = tool.name.toLowerCase()
        const categoryLower = tool.category.toLowerCase()
        let score = 0
        
        // Exact match gets highest score
        if (nameLower === query) score += 1000
        // Starts with query gets high score
        else if (nameLower.startsWith(query)) score += 500
        // Word starts with query gets medium-high score
        else if (nameLower.split(/\s+/).some(word => word.startsWith(query))) score += 300
        // Contains query gets lower score
        else if (nameLower.includes(query)) score += 100
        
        return { ...tool, score }
      })
      .sort((a, b) => b.score - a.score)
      // Deduplicate by href to remove duplicates
      .filter((tool, index, self) => 
        index === self.findIndex(t => t.href === tool.href)
      )
      .map(({ score, ...tool }) => tool) // Remove score from final result
    
    return tools
  }, [searchQuery, allTools])

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    
    const query = searchQuery.toLowerCase().trim()
    return categories.filter((category) => {
      const categoryMatches = category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      const toolMatches = category.featured.some((tool) =>
        tool.name.toLowerCase().includes(query)
      )
      return categoryMatches || toolMatches
    })
  }, [searchQuery])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Icons Background */}
      <FloatingIcons />
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:via-purple-950 dark:to-gray-900"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/30 via-purple-200/30 via-pink-200/30 to-blue-200/30 dark:from-indigo-900/20 dark:via-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 animate-gradient-xy"></div>
        
        {/* Floating blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 dark:opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-6000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-1000 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 via-pink-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient-text">
                Transform Your Workflow
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-blue-600 via-cyan-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient-text animation-delay-1000">
                With Powerful Tools
              </span>
            </h1>
            
            <p 
              className={`mt-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Discover 200+ free online utilities to streamline your tasks, boost productivity, and simplify your digital life
            </p>
            
            {/* Quick Category Links */}
            <div className={`mt-8 flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-400 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {[
                { name: 'PDF', href: '/pdf', icon: DocumentIcon },
                { name: 'Image', href: '/image', icon: PhotoIcon },
                { name: 'Text', href: '/text', icon: DocumentTextIcon },
                { name: 'Data', href: '/data', icon: TableCellsIcon },
                { name: 'File', href: '/file', icon: FolderIcon },
                { name: 'Productivity', href: '/productivity', icon: ClipboardIcon },
              ].map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 hover:shadow-md"
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.name}
                </Link>
              ))}
            </div>
            
            {/* Search Bar */}
            <div 
              className={`mt-10 max-w-2xl mx-auto transition-all duration-1000 delay-600 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative bg-indigo-600/90 dark:bg-indigo-800/90 backdrop-blur-sm text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">200+</div>
              <div className="text-indigo-100 text-sm sm:text-base">Online Tools</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">100%</div>
              <div className="text-indigo-100 text-sm sm:text-base">Free Forever</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">No Sign-Up</div>
              <div className="text-indigo-100 text-sm sm:text-base">Required</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">Privacy</div>
              <div className="text-indigo-100 text-sm sm:text-base">Focused</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Search Results
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl group-hover:from-indigo-100 group-hover:to-indigo-200 dark:group-hover:from-indigo-800/50 dark:group-hover:to-indigo-700/50 transition-all duration-300">
                      <tool.icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{tool.category}</p>
                    </div>
                  </div>
                  
                  {/* Free badge */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Free
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No tools found matching your search.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try a different search term.</p>
            </div>
          )}
        </div>
      )}

      {/* Popular Tools Section - Only show when not searching */}
      {!searchQuery.trim() && (
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Most Popular Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We present the best of the best. All free, no catch
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-1"
            >
              {/* Badge */}
              {tool.badge && (
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {tool.badge}
                </span>
              )}
              
              <div className="flex items-start gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl group-hover:from-indigo-100 group-hover:to-indigo-200 dark:group-hover:from-indigo-800/50 dark:group-hover:to-indigo-700/50 transition-all duration-300">
                  <tool.icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{tool.category}</p>
                  {tool.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {tool.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Free badge */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Free • No Sign-Up
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      )}

      {/* All Categories Section - Only show when not searching */}
      {!searchQuery.trim() && (
        <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                All Tools by Category
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Explore our complete collection of free online tools
              </p>
            </div>

            {/* Improved Category Navigation - Horizontal Scroll */}
            <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-3 min-w-max">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="group flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-0.5 min-w-[200px]"
                  >
                    <div className="p-2 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-lg group-hover:from-indigo-100 group-hover:to-indigo-200 dark:group-hover:from-indigo-800/50 dark:group-hover:to-indigo-700/50 transition-all duration-200">
                      <category.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {category.featured.length} tools
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
              <div
                key={category.name}
                className="group bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl group-hover:from-indigo-100 group-hover:to-indigo-200 dark:group-hover:from-indigo-800/50 dark:group-hover:to-indigo-700/50 transition-all duration-300">
                    <category.icon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <Link href={category.href}>
                      {category.name}
                    </Link>
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.featured.slice(0, 5).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 hover:pl-2 rounded-md"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {category.featured.length > 5 && (
                    <Link
                      href={category.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-3 group/link"
                    >
                      View all {category.featured.length} tools
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              </div>
              ))}
            </div>
        </div>
      </div>
      )}

      {/* Contact Form Section - Only on Homepage */}
      {!searchQuery.trim() && (
        <div id="contact" className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Have a Question?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Send us your query and we'll get back to you as soon as possible
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
