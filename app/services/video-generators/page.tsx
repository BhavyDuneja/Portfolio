'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Video, Building2, ShoppingBag, Share2, Sparkles,
  ArrowRight, CheckCircle2, Zap, Layers, Film,
  PlayCircle, Clock, Star
} from 'lucide-react'

const useCases = [
  {
    icon: Building2,
    title: 'Real Estate',
    description: 'AI-generated property walkthrough videos, virtual tours, and listing reels — without a videographer.',
    features: ['Property walkthroughs', 'Virtual 3D tours', 'Location showcase', 'Agent intro videos'],
  },
  {
    icon: ShoppingBag,
    title: 'D2C & E-Commerce',
    description: 'Product demo videos, unboxing-style ads, and UGC-style content at scale for your store.',
    features: ['Product showcase videos', 'Ad creatives (Meta/Google)', 'Unboxing-style reels', 'Review compilations'],
  },
  {
    icon: Share2,
    title: 'Social Media Content',
    description: 'Scroll-stopping short-form content for Instagram, YouTube Shorts, and LinkedIn — generated in bulk.',
    features: ['Instagram Reels', 'YouTube Shorts', 'LinkedIn videos', 'Story sequences'],
  },
  {
    icon: Sparkles,
    title: 'Marketing Campaigns',
    description: 'Brand videos, explainer animations, and campaign ads without the production budget.',
    features: ['Brand films', 'Explainer videos', 'Testimonial videos', 'Event highlights'],
  },
]

const benefits = [
  { icon: Zap, label: '10x faster', detail: 'vs traditional video production' },
  { icon: Clock, label: '48hr turnaround', detail: 'From brief to final video' },
  { icon: Layers, label: 'Bulk generation', detail: 'Create 100s of videos at once' },
  { icon: Film, label: 'Brand consistent', detail: 'Your colors, fonts, logo always on' },
  { icon: Star, label: 'HD quality', detail: '1080p & 4K output supported' },
  { icon: PlayCircle, label: 'Any format', detail: 'Vertical, horizontal, square' },
]

export default function VideoGeneratorsPage() {
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
            <Video className="w-4 h-4" />
            AI Video Generators
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Professional Videos.<br />
            <span className="gradient-text-saffron">No Crew Needed.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            AI-generated videos for real estate, D2C brands, social media, and marketing — produced at a fraction of the cost and time of traditional video production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Request a Sample Video</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#use-cases" className="btn-outline">
              <span>See Use Cases</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Why AI Video</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Scale Your <span className="gradient-text-saffron">Visual Content</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mb-4 group-hover:bg-saffron-500/20 transition-colors">
                  <b.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{b.label}</h3>
                <p className="text-gray-400 text-sm">{b.detail}</p>
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
              Video for <span className="gradient-text-saffron">Every Industry</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-500/10 flex items-center justify-center">
                    <uc.icon className="w-5 h-5 text-saffron-500" />
                  </div>
                  <h3 className="text-white font-semibold text-xl">{uc.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{uc.description}</p>
                <ul className="space-y-2">
                  {uc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500/60" />
                      {f}
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
            <PlayCircle className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              See What We Can Create for You
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Share your brand assets and we&apos;ll send you a sample AI-generated video within 48 hours. Free, no strings attached.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Get a Free Sample</span>
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
