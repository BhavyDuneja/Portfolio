'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Target, ArrowRight, CheckCircle2, BarChart3,
  TrendingUp, Zap, Users, Search, IndianRupee,
  FlaskConical, Eye, Globe2
} from 'lucide-react'

const tools = [
  {
    icon: Target,
    title: 'Campaign Optimization',
    description: 'AI continuously monitors and adjusts your Google & Meta campaigns — bid adjustments, audience shifts, creative swaps — in real time.',
    items: ['Automated bid management', 'Audience refinement', 'Creative performance scoring', 'Budget reallocation'],
  },
  {
    icon: Users,
    title: 'Lead Generation',
    description: 'Identify, attract, and capture high-intent leads across channels with AI-powered targeting and landing page optimization.',
    items: ['Intent-based targeting', 'Landing page A/B tests', 'Lead magnet creation', 'Form optimization'],
  },
  {
    icon: FlaskConical,
    title: 'A/B Testing at Scale',
    description: 'Test dozens of creatives, headlines, and audiences simultaneously. AI picks winners and kills losers automatically.',
    items: ['Multivariate testing', 'Statistical significance tracking', 'Auto-pause losing variants', 'Winner scaling'],
  },
  {
    icon: BarChart3,
    title: 'Conversion Tracking',
    description: 'Track every rupee from click to conversion with full-funnel attribution across all touchpoints.',
    items: ['Multi-touch attribution', 'ROAS tracking', 'Funnel drop-off analysis', 'Revenue forecasting'],
  },
  {
    icon: Search,
    title: 'Audience Intelligence',
    description: 'Deep insights into who your best customers are — demographics, interests, behavior — so you target only who converts.',
    items: ['Lookalike audiences', 'Cohort analysis', 'Churn prediction', 'LTV modeling'],
  },
  {
    icon: IndianRupee,
    title: 'Budget Optimization',
    description: 'AI allocates your budget to the channels and campaigns delivering the best returns, dynamically, every day.',
    items: ['Cross-channel allocation', 'Daily budget pacing', 'Wastage reduction', 'ROI maximization'],
  },
]

export default function AIMarketingPage() {
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
            <Target className="w-4 h-4" />
            AI Marketing Tools
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Marketing That<br />
            <span className="gradient-text-saffron">Learns & Wins.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            Data-driven AI marketing tools that optimize campaigns, generate leads, run A/B tests, and maximize every rupee you spend — automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Boost My Marketing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#tools" className="btn-outline">
              <span>See All Tools</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '3x', label: 'Average ROAS improvement' },
            { value: '40%', label: 'Lower cost per lead' },
            { value: '24/7', label: 'Campaign monitoring' },
            { value: '100%', label: 'Data-driven decisions' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Tools</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Your AI <span className="gradient-text-saffron">Marketing Stack</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mb-4 group-hover:bg-saffron-500/20 transition-colors">
                  <t.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{t.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{t.description}</p>
                <ul className="space-y-1.5">
                  {t.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
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
            <TrendingUp className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Scale Smarter?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              We&apos;ll audit your current campaigns and show you exactly where AI can reduce costs and increase results.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Book a Free Audit</span>
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
