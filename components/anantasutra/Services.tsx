'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MessageSquare, UserCheck, Users2 } from 'lucide-react'
import Link from 'next/link'
import { expertDomains } from '@/lib/expertDomains'

const steps = [
  {
    icon: MessageSquare,
    title: 'Name the role',
    description:
      'Engineer, lawyer, marketer, designer — whatever your project actually needs.',
  },
  {
    icon: UserCheck,
    title: 'We send a pro',
    description:
      'A vetted professional, hand-picked from our network across four continents.',
  },
  {
    icon: Users2,
    title: 'They work for you',
    description:
      'In-house or remote, under your direction, for hours or months — your call.',
  },
]

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-[#E8A317] text-sm font-semibold uppercase tracking-widest block mb-4">
            WHAT WE DO
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display mb-6">
            Any expert you need,{' '}
            <span className="bg-gradient-to-r from-[#E8A317] to-[#F0C040] bg-clip-text text-transparent">
              working for you.
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Tell us the field — engineering, legal, healthcare, anything. We place
            a <span className="text-white">vetted professional</span> inside your
            team, in-house or remote, for as long as you need.
          </p>
        </motion.div>

        {/* How it works — 3 steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-[#E8A317]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#E8A317]" />
                  </span>
                  <span className="text-xs font-bold text-gray-600 font-display">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Domains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-300">
            Request an expert in any domain
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {expertDomains.map((d, index) => {
            const Icon = d.icon
            return (
              <motion.div
                key={d.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.35 + index * 0.04 }}
                className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${d.accent}1f` }}
                >
                  <Icon className="w-4 h-4" style={{ color: d.accent }} />
                </span>
                <span className="text-sm font-medium text-gray-200 leading-tight">
                  {d.name}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#0A0A0F] bg-gradient-to-r from-[#E8A317] to-[#F0C040] hover:from-[#F0C040] hover:to-[#E8A317] transition-all duration-300 hover:scale-[1.02]"
          >
            <span>Request an expert</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-300"
          >
            <span>How it works</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
