'use client'

import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, Users, Sparkles } from 'lucide-react'
import ReelStrip from './ReelStrip'

const stats = [
  { icon: Briefcase, value: '3', label: 'Featured Clients' },
  { icon: Users, value: '15+', label: 'Active Engagements' },
  { icon: TrendingUp, value: '40%', label: 'Avg. Growth Lift' },
]

const PortfolioHero = () => {
  return (
    <section className="relative min-h-[92vh] flex items-stretch overflow-hidden bg-[#0A0A0F]">
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

      {/* 2-column layout: text constrained-left · reel bleeds to right edge */}
      <div className="relative z-10 w-full pt-40 pb-24 md:pb-28 flex flex-col lg:flex-row lg:items-center lg:gap-8">
        <div className="px-4 sm:px-6 lg:pl-[max(2rem,calc((100vw-1500px)/2+2rem))] lg:pr-4 w-full lg:w-auto lg:max-w-[820px] lg:flex-shrink-0">
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
            className="font-display text-5xl md:text-7xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-[1.05]"
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
            className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10"
          >
            We don&apos;t do demo projects. Below are real clients we&apos;ve built,
            scaled, and continue to support — with the numbers to back it up.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-3 gap-4"
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

        {/* Right — film reel (hidden on mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="hidden lg:block lg:flex-1 lg:h-[88vh] lg:max-h-[900px] film-reel-viewport"
        >
          <ReelStrip />
        </motion.div>
      </div>
    </section>
  )
}

export default PortfolioHero
