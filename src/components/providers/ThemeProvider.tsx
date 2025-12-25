'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
}

// Default context value for SSR
const defaultContextValue: ThemeContextType = {
  theme: 'light',
  setTheme: () => {},
  resolvedTheme: 'light',
}

const ThemeContext = createContext<ThemeContextType>(defaultContextValue)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get theme from localStorage or default to light
    const storedTheme = localStorage.getItem('theme') as Theme | null
    if (storedTheme && ['dark', 'light'].includes(storedTheme)) {
      setTheme(storedTheme)
    } else {
      // Default to light mode
      setTheme('light')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    // Simple dark/light toggle - no system mode
    const resolved = theme === 'dark' ? 'dark' : 'light'

    root.classList.add(resolved)
    setResolvedTheme(resolved)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  // Always provide the context, even during SSR
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme: mounted ? resolvedTheme : 'light',
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  // Context is always defined now (has default value), but we keep this check for safety
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

