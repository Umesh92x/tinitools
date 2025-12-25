'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentIcon, 
  PhotoIcon, 
  DocumentTextIcon,
  TableCellsIcon,
  FolderIcon,
  ClipboardIcon,
  CodeBracketIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline'

const icons = [
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  TableCellsIcon,
  FolderIcon,
  ClipboardIcon,
  CodeBracketIcon,
  CalculatorIcon,
]

interface FloatingIcon {
  id: number
  Icon: typeof DocumentIcon
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

export function FloatingIcons() {
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    // Generate floating icons
    const iconsList: FloatingIcon[] = []
    for (let i = 0; i < 15; i++) {
      iconsList.push({
        id: i,
        Icon: icons[Math.floor(Math.random() * icons.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 40,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
      })
    }
    setFloatingIcons(iconsList)
  }, [])

  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {floatingIcons.map((item) => (
        <div
          key={item.id}
          className="absolute opacity-20 dark:opacity-10 text-indigo-400 dark:text-indigo-500 animate-float-icon"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          <item.Icon className="w-full h-full" />
        </div>
      ))}
    </div>
  )
}

