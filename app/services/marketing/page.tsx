'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Camera, Palette, Share2, BarChart3, Target, Sparkles,
  ArrowRight, CheckCircle2, Megaphone, Users, PenTool,
  Layers, TrendingUp, Eye
} from 'lucide-react'

const services = [
  {
    icon: Camera,
    title: 'Professional Shooting',
    description: 'High-quality photo and video production for your brand. Product shoots, corporate videos, event coverage, and creative campaigns.',
    features: ['Product photography', 'Corporate videos', 'Event coverage', 'Drone shots', 'Studio & on-location', 'Post-production'],
  },
  {
    icon: Palette,
    title: 'Content Creation',
    description: 'Compelling visual content that tells your brand story. From graphic design to copywriting, we create content that converts.',
    features: ['Graphic design', 'Copywriting', 'Brand collateral', 'Presentation design', 'Infographics', 'Motion graphics'],
  },
  {
    icon: Share2,
    title: 'Social Media Management',
    description: 'Full social media management across all platforms. Strategy, content calendar, posting, engagement, and growth.',
    features: ['Platform strategy', 'Content calendar', 'Community management', 'Influencer collab', 'Crisis management', 'Monthly reporting'],
  },
  {
    icon: BarChart3,
    title: 'Brand Strategy',
    description: 'Build a brand that stands out. Market research, brand positioning, identity design, and go-to-market strategy.',
    features: ['Market research', 'Brand positioning', 'Identity design', 'Brand guidelines', 'Competitor analysis', 'GTM strategy'],
  },
  {
    icon: Target,
    title: 'Performance Marketing',
    description: 'ROI-driven paid campaigns across Google, Meta, LinkedIn, and more. Every rupee tracked and optimized.',
    features: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Retargeting', 'Conversion optimization', 'ROI reporting'],
  },
  {
    icon: Sparkles,
    title: 'Creative Direction',
    description: 'A unique creative identity for your brand. Art direction, visual language development, and campaign concepts.',
    features: ['Art direction', 'Visual language', 'Campaign concepts', 'Mood boards', 'Style guides', 'Creative consulting'],
  },
]

const process = [
  { step: '01', title: 'Discovery', description: 'We understand your brand, audience, and goals through deep research and conversations.', icon: Eye },
  { step: '02', title: 'Strategy', description: 'We craft a tailored marketing strategy aligned with your business objectives.', icon: Layers },
  { step: '03', title: 'Create', description: 'Our team produces high-quality content, designs, and campaigns.', icon: PenTool },
  { step: '04', title: 'Launch & Optimize', description: 'We deploy, monitor, and continuously optimize for maximum impact.', icon: TrendingUp },
]

export default function MarketingPage() {
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
            <Megaphone className="w-4 h-4" />
            Creative & Marketing Agency
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Brands That<br />
            <span className="gradient-text-violet">Resonate</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            End-to-end marketing support — from professional shooting and content creation to social media management and performance marketing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Start Your Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#services" className="btn-outline">
              <span>Our Capabilities</span>
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
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-3">Our Process</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              How We <span className="gradient-text-violet">Work</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <span className="text-4xl font-bold text-violet-500/20 font-display">{step.step}</span>
                  <step.icon className="w-6 h-6 text-violet-400 mt-3 mb-2" />
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
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
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-3">Capabilities</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Full-Service <span className="gradient-text-violet">Marketing</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <service.icon className="w-6 h-6 text-violet-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-500/60" />
                      {feature}
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
              Let&apos;s Build Your Brand
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              From shooting to social media, we handle everything. Tell us your vision and we&apos;ll make it real.
            </p>
            <Link href="/contact" className="btn-primary">
              <span>Start a Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
