'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Camera, Video, ArrowRight, CheckCircle2,
  Aperture, Layers, Star, Users, MapPin,
  Sparkles, Film, Image
} from 'lucide-react'

const services = [
  {
    icon: Camera,
    title: 'Product Photography',
    description: 'Studio-quality product shots that make your catalog pop — on white backgrounds, lifestyle setups, or creative compositions.',
    items: ['White background shots', 'Lifestyle / in-context shots', 'Flat lay compositions', '360° product views', 'Bulk shoot packages', 'Same-day turnaround'],
  },
  {
    icon: Video,
    title: 'Corporate Videos',
    description: 'Professional brand films, office tours, team introductions, and corporate communications that reflect your brand.',
    items: ['Brand films', 'Office / facility tours', 'Team introduction videos', 'Investor presentations', 'Testimonial videos', 'Training content'],
  },
  {
    icon: Film,
    title: 'Social Media Reels',
    description: 'Scroll-stopping short-form video content for Instagram, LinkedIn, and YouTube Shorts — edited and ready to post.',
    items: ['Instagram Reels', 'YouTube Shorts', 'LinkedIn video posts', 'Trending format edits', 'Caption overlays', 'Music & transitions'],
  },
  {
    icon: Aperture,
    title: 'Event Coverage',
    description: 'Full-day photography and videography for launches, conferences, corporate events, and brand activations.',
    items: ['Event photography', 'Highlight reel video', 'Live coverage', 'Same-day previews', 'Full edited delivery', 'Raw footage handoff'],
  },
]

const extras = [
  { icon: MapPin, label: 'On-location shoots', detail: 'We come to you — office, store, warehouse, or outdoor' },
  { icon: Sparkles, label: 'Professional editing', detail: 'Color grading, retouching, and motion graphics included' },
  { icon: Layers, label: 'Multi-format delivery', detail: 'Get files in every size — web, print, social, 4K' },
  { icon: Star, label: 'Brand consistency', detail: 'Every frame aligned with your colors, fonts, and guidelines' },
]

export default function ContentShootingPage() {
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
            <Camera className="w-4 h-4" />
            Content Shooting
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Visuals That<br />
            <span className="gradient-text-violet">Stop the Scroll.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            Professional photo and video production for brands that want to look premium. Products, corporate, events, and social content — all under one roof.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Book a Shoot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#services" className="btn-outline">
              <span>See What We Shoot</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Extras */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {extras.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5"
            >
              <e.icon className="w-5 h-5 text-violet-400 mb-3" />
              <p className="text-white font-semibold text-sm mb-1">{e.label}</p>
              <p className="text-gray-500 text-xs">{e.detail}</p>
            </motion.div>
          ))}
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
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-3">What We Shoot</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Every Format <span className="gradient-text-violet">Covered</span>
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
            <Image className="w-10 h-10 text-violet-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Look the Part?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Tell us what you need and we&apos;ll put together a shoot package tailored to your brand and budget.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Book a Shoot</span>
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
