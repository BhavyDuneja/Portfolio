'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  MessageSquare,
  UserCheck,
  Users2,
  Clock,
  MapPin,
  ShieldCheck,
  Repeat,
} from 'lucide-react'
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

const engagement = [
  {
    icon: Clock,
    title: 'Any duration',
    description: 'A few hours, a sprint, or an ongoing seat on your team.',
  },
  {
    icon: MapPin,
    title: 'In-house or remote',
    description: 'On-site with your team or working remotely — your call.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted & accountable',
    description: 'Pre-screened professionals who own their outcomes.',
  },
  {
    icon: Repeat,
    title: 'Swap when needed',
    description: 'Need a different fit? We re-match, fast.',
  },
]

export default function ServicesPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] right-[5%] w-[500px] h-[500px] bg-[#E8A317]/8 rounded-full blur-[130px]" />
          <div className="absolute bottom-[-15%] left-[5%] w-[500px] h-[500px] bg-[#6A3DE8]/8 rounded-full blur-[130px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#E8A317] uppercase tracking-[0.2em] text-sm font-medium mb-5"
          >
            Experts On Demand
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.05]"
          >
            Any expert you need,{' '}
            <span className="gradient-text-saffron">working for you.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Tell us the field — engineering, legal, healthcare, anything. We place
            a vetted professional inside your team, in-house or remote, for as long
            as you need.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#0A0A0F] bg-gradient-to-r from-[#E8A317] to-[#F0C040] hover:from-[#F0C040] hover:to-[#E8A317] transition-all duration-300 hover:scale-[1.02]"
            >
              <span>Request an expert</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#6A3DE8] text-sm font-semibold uppercase tracking-widest block mb-4">
              How it works
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              From need to embedded expert
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-11 h-11 rounded-xl bg-[#E8A317]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#E8A317]" />
                    </span>
                    <span className="text-sm font-bold text-gray-600 font-display">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Domains */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#E8A317] text-sm font-semibold uppercase tracking-widest block mb-4">
              Domains
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Pick any field. We&apos;ve got the pro.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Name the role you need — here are the domains we place people in today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertDomains.map((d, index) => {
              const Icon = d.icon
              return (
                <motion.div
                  key={d.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 hover:border-white/20 transition-all duration-400 flex flex-col"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${d.accent}18` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: d.accent }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{d.name}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5 flex-1">
                    {d.blurb}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {d.roles.map((role) => (
                      <span
                        key={role}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-gray-400 bg-white/[0.03]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: d.accent }}
                  >
                    <span>Request this expert</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            Don&apos;t see your domain?{' '}
            <Link href="/contact" className="text-[#E8A317] hover:underline">
              Ask us — chances are we&apos;ve got someone.
            </Link>
          </p>
        </div>
      </section>

      {/* Engagement flexibility */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#6A3DE8] text-sm font-semibold uppercase tracking-widest block mb-4">
              On your terms
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Flexible by design
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagement.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-7"
                >
                  <span className="w-12 h-12 rounded-xl bg-[#6A3DE8]/10 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-6 h-6 text-[#6A3DE8]" />
                  </span>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#E8A317]/40 to-transparent" />
          <p className="text-[#E8A317] uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Tell us who you need
          </p>
          <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Your next team member is one message away
          </h3>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
            Tell us the domain and the duration. We&apos;ll bring you a vetted
            expert who works the way your team works.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              <span>Request an expert</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/portfolio" className="btn-outline">
              <span>See our work</span>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
