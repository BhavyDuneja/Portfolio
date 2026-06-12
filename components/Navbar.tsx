'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Menu,
  X,
  ChevronDown,
  Code2,
  Bot,
  Palette,
  Clapperboard,
  Megaphone,
  Briefcase,
  Building2,
  ShoppingBag,
  Scale,
  Stethoscope,
  Plane,
  GraduationCap,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

// Domain expertise areas — a client can request an embedded expert from any of these.
const servicesMenu = [
  {
    title: 'Build & Technical',
    description: 'Engineers, designers and AI talent that ships',
    items: [
      { name: 'Engineering & Software', href: '/services', icon: Code2 },
      { name: 'AI & Data', href: '/services', icon: Bot },
      { name: 'Design & Creative', href: '/services', icon: Palette },
      { name: 'Video & Content', href: '/services', icon: Clapperboard },
    ],
  },
  {
    title: 'Growth & Business',
    description: 'Marketing, finance and operations specialists',
    items: [
      { name: 'Marketing & Growth', href: '/services', icon: Megaphone },
      { name: 'Finance & Business', href: '/services', icon: Briefcase },
      { name: 'Property & Real Estate', href: '/services', icon: Building2 },
      { name: 'E-commerce & Retail', href: '/services', icon: ShoppingBag },
    ],
  },
  {
    title: 'Specialised',
    description: 'Legal, healthcare and global-mobility experts',
    items: [
      { name: 'Legal & Compliance', href: '/services', icon: Scale },
      { name: 'Healthcare', href: '/services', icon: Stethoscope },
      { name: 'Immigration & Mobility', href: '/services', icon: Plane },
      { name: 'Academic & Research', href: '/services', icon: GraduationCap },
    ],
  },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services', hasDropdown: true },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Apps', href: '/apps' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const pathname = usePathname();
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaMenuOpen(false);
  }, [pathname]);

  // Hide navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const handleMegaEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  };

  const handleMegaLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 400);
  };

  const toggleMobileSection = (title: string) => {
    setExpandedMobileSection((prev) => (prev === title ? null : title));
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(10,10,15,0.8)] backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo-nobg.png"
                alt="AnantaSutra Logo"
                width={44}
                height={44}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span
                className="text-2xl font-bold bg-gradient-to-r from-[#E8A317] to-[#FFB800] bg-clip-text text-transparent"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                AnantaSutra
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={handleMegaEnter}
                    onMouseLeave={handleMegaLeave}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive(link.href)
                          ? 'text-[#E8A317]'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          megaMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    {/* Mega Menu */}
                    <AnimatePresence>
                      {megaMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-[780px] pt-3 pointer-events-auto"
                          style={{ zIndex: 60 }}
                        >
                          <div className="bg-[rgba(10,10,15,0.95)] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 p-6">
                          {/* What we do — clarity banner */}
                          <div className="mb-5 pb-5 border-b border-white/10">
                            <p className="text-[#E8A317] text-[11px] font-semibold uppercase tracking-widest mb-1.5">
                              What we do
                            </p>
                            <h3 className="text-white font-bold text-base leading-snug">
                              Vetted experts in any field, working for you
                            </h3>
                            <p className="text-gray-400 text-xs mt-1">
                              Name the role. We place a professional inside your team — in-house or remote.
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-6">
                            {servicesMenu.map((section) => (
                              <div key={section.title}>
                                <h3 className="text-white font-semibold text-sm mb-1">
                                  {section.title}
                                </h3>
                                <p className="text-gray-400 text-xs mb-3">{section.description}</p>
                                <div className="space-y-1">
                                  {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                      <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group/item"
                                      >
                                        <Icon className="w-4 h-4 text-gray-500 group-hover/item:text-[#E8A317] transition-colors" />
                                        <span className="text-sm">{item.name}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bottom CTA */}
                          <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between gap-4">
                            <span className="text-gray-400 text-xs">
                              Any domain, any duration — in-house or remote.
                            </span>
                            <Link
                              href="/contact"
                              className="inline-flex items-center gap-1.5 text-[#E8A317] text-sm font-semibold whitespace-nowrap hover:gap-2.5 transition-all"
                            >
                              Request an expert
                              <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                            </Link>
                          </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive(link.href)
                        ? 'text-[#E8A317]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* CTA + Theme Toggle + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-[#E8A317] to-[#FFB800] hover:shadow-lg hover:shadow-[#E8A317]/25 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0A0A0F] border-l border-white/10 overflow-y-auto">
              <div className="p-6 pt-24 space-y-2">
                {navLinks.map((link) =>
                  link.hasDropdown ? (
                    <div key={link.name}>
                      <button
                        onClick={() => toggleMobileSection(link.name)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left font-medium transition-all ${
                          isActive(link.href)
                            ? 'text-[#E8A317] bg-[#E8A317]/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            expandedMobileSection === link.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expandedMobileSection === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-2 space-y-3">
                              {servicesMenu.map((section) => (
                                <div key={section.title}>
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-1">
                                    {section.title}
                                  </p>
                                  {section.items.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                      <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                      >
                                        <Icon className="w-4 h-4 text-gray-500" />
                                        {item.name}
                                      </Link>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive(link.href)
                          ? 'text-[#E8A317] bg-[#E8A317]/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                )}

                <div className="pt-4">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-5 py-3 rounded-full text-sm font-semibold text-black bg-gradient-to-r from-[#E8A317] to-[#FFB800] hover:shadow-lg hover:shadow-[#E8A317]/25 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
