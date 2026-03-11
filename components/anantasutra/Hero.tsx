'use client'

import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  const headingWords1 = ['Infinite', 'Wisdom']
  const headingWords2 = ['Applied']
  const subtitleWords = 'We are AnantaSutra — a constellation of ventures spanning AI, marketing, technology, spirituality, and human potential.'.split(' ')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F]">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#6A3DE8]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#E8A317]/8 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-[#6A3DE8]/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-[#E8A317]/5 rounded-full blur-[80px]"></div>
      </div>

      {/* Sanskrit Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[20vw] font-bold text-white/[0.03] leading-none font-display">
          अनन्तसूत्र
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4 text-[#E8A317]" />
          <span className="text-sm text-gray-400 tracking-wide">Where Innovation Meets Tradition</span>
        </motion.div>

        {/* Main Heading */}
        <div className="mb-6">
          <h1 className="font-display">
            {/* Line 1: Infinite Wisdom */}
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
            {/* Line 2: Applied */}
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

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12"
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

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/services"
            className="btn-primary bg-[#E8A317] hover:bg-[#D4940F] text-black px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-[#E8A317]/20 hover:shadow-[#E8A317]/40 transition-all duration-300 hover:scale-105"
          >
            Explore Our Universe
          </Link>
          <Link
            href="/contact"
            className="btn-outline border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 hover:border-white/40 transition-all duration-300 hover:scale-105"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
