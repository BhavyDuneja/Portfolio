'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

type Theme = 'dark' | 'light'

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved =
      (typeof window !== 'undefined' &&
        (document.documentElement.getAttribute('data-theme') as Theme)) ||
      'dark'
    setTheme(saved === 'light' ? 'light' : 'dark')
    setMounted(true)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore quota / privacy mode */
    }
  }

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={`w-10 h-10 rounded-full border border-white/10 bg-white/5 ${className}`}
      />
    )
  }

  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      className={`relative w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:border-[#E8A317]/40 hover:bg-white/10 transition-all duration-300 ${className}`}
    >
      <Sun
        className={`absolute w-4 h-4 text-[#E8A317] transition-all duration-300 ${
          isLight ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'
        }`}
      />
      <Moon
        className={`absolute w-4 h-4 text-gray-300 transition-all duration-300 ${
          isLight ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'
        }`}
      />
    </button>
  )
}

export default ThemeToggle
