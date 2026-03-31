'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users, Share2, ArrowRight, CheckCircle2,
  Calendar, BarChart3, MessageSquare, TrendingUp,
  Eye, Layers, PenTool, Star
} from 'lucide-react'

const services = [
  {
    icon: Calendar,
    title: 'Strategy & Content Calendar',
    description: 'We build a custom content strategy and monthly calendar aligned with your brand goals, audience, and seasonal trends.',
    items: ['Platform-specific strategy', '30-day content calendar', 'Theme & pillar planning', 'Competitor analysis', 'Content mix (edu / promo / engage)', 'Weekly review calls'],
  },
  {
    icon: PenTool,
    title: 'Content Creation',
    description: 'Scroll-stopping graphics, captions, and short-form video — produced weekly and ready to publish.',
    items: ['Branded graphic design', 'Caption writing', 'Reel / short video editing', 'Story sequences', 'Carousel posts', 'Thumbnail design'],
  },
  {
    icon: MessageSquare,
    title: 'Community Management',
    description: 'We respond to comments, DMs, and mentions — building real relationships with your audience every day.',
    items: ['Comment moderation', 'DM management', 'Review responses', 'Engagement outreach', 'Crisis handling', 'Influencer DMs'],
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reporting',
    description: 'Monthly performance reports with insights on what worked, what didn\'t, and what we\'re optimizing next.',
    items: ['Reach & impression tracking', 'Engagement rate analysis', 'Follower growth charts', 'Best post breakdown', 'ROI reporting', 'Competitor benchmarking'],
  },
]

const process = [
  { step: '01', icon: Eye, title: 'Audit & Strategy', description: 'We audit your current presence, define your voice, and build a 90-day growth strategy.' },
  { step: '02', icon: PenTool, title: 'Content Production', description: 'Our team creates all content — graphics, captions, reels — and schedules them for peak engagement.' },
  { step: '03', icon: MessageSquare, title: 'Engage Daily', description: 'We manage your community, respond to comments and DMs, and grow your follower base organically.' },
  { step: '04', icon: TrendingUp, title: 'Optimize Monthly', description: 'Monthly reports + strategy refinements based on what the data tells us is working.' },
]

export default function SocialMediaPage() {
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[120px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6"
          >
            <Share2 className="w-4 h-4" />
            Social Media Management
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            We Run Your<br />
            <span className="gradient-text-violet">Social Media.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            Full-service social media management — strategy, content creation, daily posting, community engagement, and monthly reporting. You focus on business, we handle your presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Get a Free Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#services" className="btn-outline">
              <span>What&apos;s Included</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-3">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Our <span className="gradient-text-violet">4-Step Process</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <span className="text-4xl font-bold text-violet-500/20 font-display">{p.step}</span>
                  <p.icon className="w-6 h-6 text-violet-400 mt-3 mb-2" />
                  <h3 className="text-white font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
                </div>
                {i < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-violet-500/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-3">Services</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Everything <span className="gradient-text-violet">Included</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-violet-500" />
                  </div>
                  <h3 className="text-white font-semibold text-xl">{s.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.description}</p>
                <ul className="grid grid-cols-2 gap-1.5">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle2 className="w-3 h-3 text-violet-500/60 flex-shrink-0" />
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            <Users className="w-10 h-10 text-violet-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Let&apos;s Grow Your Presence
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              We&apos;ll audit your current profiles for free and show you exactly where you&apos;re leaving growth on the table.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Get Free Audit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services/marketing" className="btn-outline">
                <span>All Marketing Services</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
