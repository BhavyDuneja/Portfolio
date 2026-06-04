'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Code2,
  Globe,
  Monitor,
  Bot,
  Megaphone,
  Palette,
  Clapperboard,
  Scale,
  Building2,
  ShoppingBag,
  MapPin,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'

type Domain = { label: string; icon: LucideIcon; accent: string }

const SAFFRON = '#E8A317'
const VIOLET = '#6A3DE8'

const domains: Domain[] = [
  { label: 'Engineering', icon: Code2, accent: SAFFRON },
  { label: 'Web Apps', icon: Globe, accent: VIOLET },
  { label: 'Desktop', icon: Monitor, accent: SAFFRON },
  { label: 'AI & Automation', icon: Bot, accent: VIOLET },
  { label: 'Marketing', icon: Megaphone, accent: SAFFRON },
  { label: 'Graphic Design', icon: Palette, accent: VIOLET },
  { label: 'Video & Content', icon: Clapperboard, accent: SAFFRON },
  { label: 'Legal Matters', icon: Scale, accent: VIOLET },
  { label: 'Property', icon: Building2, accent: SAFFRON },
  { label: 'E-commerce', icon: ShoppingBag, accent: VIOLET },
]

const locations = [
  // International first
  'Japan',
  'Qatar',
  'Canada',
  'Australia',
  'UAE',
  'Russia',
  'Germany',
  'London',
  'Paris',
  // India
  'Delhi',
  'Jaipur',
  'Vrindavan',
  'Faridabad',
  'Haryana',
]

const DomainCollage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative w-full rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5 lg:p-6 overflow-hidden"
    >
      {/* Corner glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#E8A317]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#6A3DE8]/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10">
        <span className="text-[#E8A317] text-xs font-semibold uppercase tracking-widest block mb-4">
          What we&apos;ve built across
        </span>

        {/* Domain frame collage */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {domains.map((d, i) => {
            const Icon = d.icon
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.05 }}
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${d.accent}1f` }}
                >
                  <Icon className="w-4 h-4" style={{ color: d.accent }} />
                </span>
                <span className="text-[13px] font-medium text-gray-200 leading-tight">
                  {d.label}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Locations served — international first */}
        <div className="flex items-center gap-2 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-[#6A3DE8]" />
          <span className="text-xs uppercase tracking-widest text-gray-400">
            Where we&apos;ve served
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {locations.map((loc) => (
            <span
              key={loc}
              className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-gray-300 bg-white/[0.03]"
            >
              {loc}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-white/[0.08]">
          <p className="text-sm text-gray-300 mb-3">
            Got a domain that isn&apos;t on this list yet?{' '}
            <span className="text-white font-medium">
              Let&apos;s make yours the next one.
            </span>
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-[#0A0A0F] bg-gradient-to-r from-[#E8A317] to-[#F0C040] hover:from-[#F0C040] hover:to-[#E8A317] transition-all duration-300 hover:scale-[1.02]"
          >
            <span>Work with us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default DomainCollage
