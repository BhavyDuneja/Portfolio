'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Share2, Instagram, Twitter, Linkedin, Youtube,
  ArrowRight, CheckCircle2, Clock, BarChart3,
  Zap, Bot, Calendar, TrendingUp
} from 'lucide-react'

const platforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-400' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400' },
  { name: 'Twitter / X', icon: Twitter, color: 'text-sky-400' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-400' },
]

const features = [
  {
    icon: Bot,
    title: 'AI Content Generation',
    description: 'Captions, hashtags, and post copy auto-generated from your brand voice and product catalog.',
    items: ['Brand-tone aware writing', 'Hashtag research', 'Caption variations for A/B', 'Bulk content generation'],
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Posts go out at peak times for your audience — automatically, no manual effort.',
    items: ['Optimal time posting', 'Multi-platform at once', 'Content calendar view', 'Queue management'],
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'See exactly what works — reach, engagement, follower growth, and best-performing posts.',
    items: ['Engagement tracking', 'Follower growth charts', 'Best post insights', 'Competitor benchmarking'],
  },
  {
    icon: TrendingUp,
    title: 'Growth Automation',
    description: 'Auto-engage with comments, DMs, and relevant content to grow your audience organically.',
    items: ['Comment responses', 'DM automation', 'Follower targeting', 'Story sequences'],
  },
]

export default function SocialAutomationPage() {
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
            <Share2 className="w-4 h-4" />
            Social Media Automation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Social Media<br />
            <span className="gradient-text-saffron">on Autopilot.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            AI generates your content, schedules it at the best times, and grows your audience across Instagram, LinkedIn, YouTube, and X — without you lifting a finger.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link href="/contact" className="btn-primary">
              <span>Start Automating</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="btn-outline">
              <span>See Features</span>
            </a>
          </motion.div>

          {/* Platform badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm">
                <p.icon className={`w-4 h-4 ${p.color}`} />
                <span className="text-gray-300">{p.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '4+', label: 'Platforms covered' },
            { value: '10x', label: 'Content output vs manual' },
            { value: '24/7', label: 'Posting & engagement' },
            { value: '0', label: 'Hours you spend on it' },
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

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Features</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Everything Your Social <span className="gradient-text-saffron">Needs</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/10 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-saffron-500" />
                  </div>
                  <h3 className="text-white font-semibold text-xl">{f.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{f.description}</p>
                <ul className="space-y-2">
                  {f.items.map((item) => (
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
            <Zap className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Stop Posting Manually
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Let AI handle your social media while you focus on building your business.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Get Started Today</span>
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
