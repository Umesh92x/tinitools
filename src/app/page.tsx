import Link from 'next/link'
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
} from '@heroicons/react/24/outline'

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

export default function Home() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Free Online Tools for Everyone
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, fast, and free online utilities to help you with your daily tasks.
            Privacy-focused, reliable tools that just work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50"
            >
              <div className="flex items-center gap-x-4">
                <div className="flex-shrink-0">
                  <category.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  <Link href={category.href} className="hover:text-indigo-600 transition-colors">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {category.name}
                  </Link>
                </h2>
              </div>
              <p className="mt-4 text-base text-gray-600">{category.description}</p>
              <div className="mt-4 space-y-2">
                {category.featured.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
