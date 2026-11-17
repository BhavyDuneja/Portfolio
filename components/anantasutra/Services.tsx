'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, MessageSquare, UserCheck, Users2 } from 'lucide-react'
import Link from 'next/link'
import { expertDomains } from '@/lib/expertDomains'
import { aiSolutions, AI_SOLUTIONS_HUB } from '@/lib/aiSolutions'

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
            Vetted experts and AI solutions,{' '}
            <span className="bg-gradient-to-r from-[#E8A317] to-[#F0C040] bg-clip-text text-transparent">
              working for you.
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Tell us the field — engineering, legal, healthcare, anything. We place
            a <span className="text-white">vetted professional</span> inside your
            team, in-house or remote, for as long as you need. And where software
            does the job better, we put an{' '}
            <span className="text-white">AI solution</span> on it, running 24/7.
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
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

        {/* AI Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-center mb-8 max-w-2xl mx-auto"
        >
          <span className="text-[#6A3DE8] text-sm font-semibold uppercase tracking-widest block mb-3">
            AI Solutions
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
            Or let AI do the job, 24/7
          </h3>
          <p className="text-gray-400">
            Some work runs better on software than on a seat. We build, deploy and
            monitor the AI that takes it over, at transparent per-use prices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {aiSolutions.map((s, index) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.06 }}
                className="h-full"
              >
                <Link
                  href={s.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${s.accent}1f` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.accent }} />
                    </span>
                    {s.price && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 text-gray-200 bg-white/[0.04]">
                        {s.price}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{s.name}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1">{s.blurb}</p>
                  <span
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: s.accent }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="text-center text-sm text-gray-500 mb-16"
        >
          Want the whole suite in one place?{' '}
          <Link href={AI_SOLUTIONS_HUB} className="text-[#E8A317] hover:underline">
            See all AI solutions
          </Link>
        </motion.p>

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
