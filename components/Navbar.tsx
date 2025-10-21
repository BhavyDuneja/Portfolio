'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code, User, Briefcase, Award, Star, Mail, BookOpen, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation items for Anantasutra website
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Code },
    { name: 'Projects & Testimonials', href: '/testimonials', icon: Star },
    { name: 'Co-founder', href: '/co-founder', icon: User },
    { name: 'Contact', href: '/contact', icon: Mail },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) {
      // External link - navigate to the page
      window.location.href = href
    } else {
      // Internal section - check if we're on home page first
      if (window.location.pathname !== '/') {
        // If not on home page, navigate to home first, then scroll
        window.location.href = `/${href}`
      } else {
        // If on home page, scroll to section
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Anantasutra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-emerald-200 mt-4 pt-4"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 text-center mt-4"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar

