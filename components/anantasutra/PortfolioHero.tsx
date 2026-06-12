'use client'

import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, Users, Sparkles } from 'lucide-react'
// import ReelStrip from './ReelStrip' // vertical reel disabled — using horizontal BrandMarquee inside the hero instead
import BrandMarquee from './BrandMarquee'

const stats = [
  { icon: Briefcase, value: '10', label: 'Featured Clients' },
  { icon: Users, value: '4', label: 'Continents Served' },
  { icon: TrendingUp, value: '46%', label: 'Peak Revenue Lift' },
]

const PortfolioHero = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden bg-[#0A0A0F]">
      {/* Background Mesh */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#6A3DE8]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#E8A317]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Sanskrit Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[18vw] font-bold text-white/[0.03] leading-none font-display">
          कर्म
        </span>
      </div>

      {/* Hero copy + stats — centred in remaining space */}
      <div className="relative z-10 flex-1 flex items-center w-full pt-32 pb-10">
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-[#E8A317]" />
              <span className="text-sm text-gray-300 tracking-wide">Our Portfolio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.05]"
            >
              <span className="block whitespace-nowrap">Real Work.</span>
              <span className="block whitespace-nowrap bg-gradient-to-r from-[#E8A317] via-[#F0C040] to-[#E8A317] bg-clip-text text-transparent">
                Real Results.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-xl"
            >
              We don&apos;t do demo projects. Below are real clients we&apos;ve built,
              scaled, and continue to support — with the numbers to back it up.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="grid grid-cols-3 gap-4 max-w-xl"
            >
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm"
                  >
                    <Icon className="w-5 h-5 text-[#E8A317] mb-3" />
                    <div className="text-2xl md:text-3xl font-bold text-white font-display mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Brand marquee — pinned to the bottom of the hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 w-full pb-12 md:pb-16"
      >
        <BrandMarquee />
      </motion.div>
    </section>
  )
}

export default PortfolioHero
