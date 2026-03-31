'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Bot, Phone, Mic, BarChart3, Globe2, Clock, Zap,
  IndianRupee, ArrowRight, CheckCircle2, Headphones,
  ShoppingBag, HeartPulse, Building2, Users
} from 'lucide-react'

const useCases = [
  { icon: ShoppingBag, title: 'D2C & E-Commerce', description: 'COD confirmation, order updates, cart recovery, post-purchase surveys' },
  { icon: HeartPulse, title: 'Healthcare', description: 'Appointment reminders, follow-up calls, patient feedback collection' },
  { icon: Building2, title: 'Real Estate', description: 'Lead qualification, site visit scheduling, property inquiry handling' },
  { icon: Users, title: 'Collections & Lending', description: 'Payment reminders, EMI follow-ups, loan closure communication' },
]

const features = [
  { icon: Mic, label: 'Human-like voice', detail: 'Natural speech with Indian accent support' },
  { icon: Globe2, label: 'Multi-language', detail: 'Hindi, English, Hinglish and more' },
  { icon: Clock, label: '24/7 availability', detail: 'Never misses a call, any time zone' },
  { icon: BarChart3, label: 'Real-time analytics', detail: 'Call outcomes, sentiment, transcripts' },
  { icon: Zap, label: '<1s response latency', detail: 'No awkward pauses in conversation' },
  { icon: Bot, label: 'Custom personas', detail: 'Brand voice, script, and tone control' },
]

const stats = [
  { value: '₹6', suffix: '/min', label: 'Flat pricing, no hidden fees' },
  { value: '24/7', suffix: '', label: 'Always-on voice agent' },
  { value: '<1s', suffix: '', label: 'Response latency' },
  { value: '10+', suffix: '', label: 'Languages supported' },
]

export default function VoiceAgentsPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)
      })
    }
  }, [])

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-saffron-500/5 blur-[120px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-sm font-medium mb-6"
          >
            <Phone className="w-4 h-4" />
            AI Voice Calling Agents
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Calls Handled.<br />
            <span className="gradient-text-saffron">At ₹6/min.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            Deploy AI voice agents that make and receive phone calls 24/7 — with human-like conversation, real-time transcripts, and full analytics. No agents, no salaries, no off days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Book a Free Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#use-cases" className="btn-outline">
              <span>See Use Cases</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <p className="text-3xl font-bold text-white">{stat.value}<span className="text-saffron-400">{stat.suffix}</span></p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Capabilities</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Built for <span className="gradient-text-saffron">Indian Businesses</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mb-4 group-hover:bg-saffron-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{f.label}</h3>
                <p className="text-gray-400 text-sm">{f.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Use Cases</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Works Across <span className="gradient-text-saffron">Every Industry</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8 flex gap-5 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center flex-shrink-0">
                  <uc.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{uc.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{uc.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing callout */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
          >
            <IndianRupee className="w-10 h-10 text-saffron-500 flex-shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-bold text-2xl mb-1">Simple Pricing — ₹6/min</h3>
              <p className="text-gray-400">No setup fees, no monthly minimums. Pay only for the minutes your agent talks. Scale up or down anytime.</p>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap flex-shrink-0">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/50 to-transparent" />
            <Headphones className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Deploy Your First Agent?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              We&apos;ll set up a demo call with your own AI agent in 48 hours. No commitment needed.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Book Free Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services/ai-automation" className="btn-outline">
                <span>All AI Services</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
