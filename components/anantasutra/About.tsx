'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const paragraphs = [
    "AnantaSutra — meaning 'Infinite Wisdom' — is not just a company. It is a living ecosystem of ventures, each a thread in an infinite tapestry of knowledge, innovation, and human potential. Founded with a vision that transcends industry boundaries.",
    "From AI-powered automation that transforms businesses, to marketing solutions that amplify brands, to apps that preserve ancient wisdom and nurture daily rituals — every thread we weave carries purpose.",
    "We believe in the convergence of technology and tradition, where cutting-edge innovation meets timeless wisdom.",
  ]

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-[#0A0A0F] overflow-hidden">
      {/* Sacred-geometry mandala backdrop — left half of the disc bleeds in from the right edge */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bg%26site/geometrymandla.png"
          alt=""
          className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-[135%] w-auto max-w-none opacity-50 object-contain"
        />
        {/* Left-to-right fade so the philosophy copy stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-[#E8A317] text-sm font-semibold uppercase tracking-widest">
            OUR PHILOSOPHY
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 font-display"
        >
          The Endless Thread of Knowledge
        </motion.h2>

        {/* Paragraphs */}
        <div className="space-y-8 mb-16">
          {paragraphs.map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + index * 0.15 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* Decorative Line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          className="origin-left"
        >
          <div className="h-[1px] w-full bg-gradient-to-r from-[#E8A317] via-[#E8A317]/50 to-transparent"></div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
