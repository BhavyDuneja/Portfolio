'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  const headingWords1 = ['Infinite', 'Wisdom']
  const headingWords2 = ['Applied']
  const subtitleWords =
    'We embed vetted domain experts inside your team — engineers, marketers, designers, any field — and you pay just their salary. No markup, no lock-ins, live in 7 days.'.split(' ')

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-[#0A0A0F]">
      {/* Background Video (with image fallback as poster) */}
      <video
        className="absolute inset-0 w-full h-full object-cover hero-bg-image"
        src="/videos/hero-bg.mp4"
        poster="/images/background.png"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      ></video>

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F]/90 via-[#0A0A0F]/60 to-[#0A0A0F]/30 hero-bg-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent hero-bg-overlay"></div>

      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#6A3DE8]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#E8A317]/8 rounded-full blur-[120px]"></div>
      </div>

      {/* Sanskrit Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-bold text-white/[0.03] leading-none font-display">
          अनन्तसूत्र
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pb-28 text-left">
        <div className="max-w-3xl">
          {/* Sparkle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#E8A317]" />
            <span className="text-sm text-gray-300 tracking-wide">
              Not a project. A dedicated expert.
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="mb-6">
            <h1 className="font-display">
              <span className="block text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2">
                {headingWords1.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
                    className="inline-block mr-4"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block text-6xl md:text-8xl lg:text-9xl font-bold">
                {headingWords2.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 + i * 0.15 }}
                    className="inline-block bg-gradient-to-r from-[#E8A317] via-[#F0C040] to-[#E8A317] bg-clip-text text-transparent"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed mb-10"
          >
            {subtitleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.03 }}
                className="inline-block mr-1"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-start items-start"
          >
            <Link
              href="/services/dedicated-experts"
              className="btn-primary bg-[#E8A317] hover:bg-[#D4940F] text-black px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-[#E8A317]/20 hover:shadow-[#E8A317]/40 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Get Your Expert
            </Link>
            <Link
              href="/contact"
              className="btn-outline border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
