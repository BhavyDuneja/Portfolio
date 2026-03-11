'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Phone, Video, Share2, Mail, Target, Users, ArrowRight,
  CheckCircle2, Zap, IndianRupee, Clock, Bot, Headphones,
  MessageSquare, BarChart3, Mic
} from 'lucide-react'

const services = [
  {
    icon: Phone,
    title: 'Voice Calling Agents',
    price: '₹6/min',
    description: 'AI-powered voice agents that handle inbound and outbound calls across any domain — sales, support, appointments, surveys, and more.',
    features: ['24/7 availability', 'Multi-language support', 'Any domain/industry', 'Real-time analytics', 'Human-like conversations', 'CRM integration'],
  },
  {
    icon: Video,
    title: 'AI Video Generators',
    description: 'Professional AI-generated videos for real estate listings, product showcases, social media content, and marketing campaigns.',
    features: ['Real estate walkthroughs', 'Product demo videos', 'Social media reels', 'Automated editing', 'Brand consistency', 'Bulk generation'],
  },
  {
    icon: Share2,
    title: 'Social Media Automation',
    description: 'Put your social media on autopilot. AI-driven content scheduling, engagement, and growth across all platforms.',
    features: ['Multi-platform posting', 'AI content generation', 'Engagement automation', 'Analytics dashboard', 'Hashtag optimization', 'Audience targeting'],
  },
  {
    icon: Mail,
    title: 'Gmail Automation',
    description: 'Smart email workflows that handle responses, follow-ups, categorization, and lead nurturing automatically.',
    features: ['Auto-responses', 'Smart categorization', 'Follow-up sequences', 'Lead scoring', 'Template management', 'Integration ready'],
  },
  {
    icon: Target,
    title: 'AI Marketing Tools',
    description: 'Data-driven marketing automation tools that optimize campaigns, generate leads, and maximize ROI.',
    features: ['Campaign optimization', 'Lead generation', 'A/B testing', 'Conversion tracking', 'Audience insights', 'Budget optimization'],
  },
  {
    icon: Users,
    title: 'Recruiter AI',
    price: '₹2/lead',
    description: 'AI-powered recruitment tool that finds, qualifies, and connects you with the right candidates or job opportunities.',
    features: ['Job search assistance', 'Candidate matching', 'Resume parsing', 'Boolean search generation', 'Cold email outreach', 'Lead enrichment'],
  },
]

const stats = [
  { icon: IndianRupee, value: '₹6', label: 'Per minute voice agents', suffix: '/min' },
  { icon: IndianRupee, value: '₹2', label: 'Per lead recruiter AI', suffix: '/lead' },
  { icon: Clock, value: '24/7', label: 'AI availability' },
  { icon: Zap, value: '10x', label: 'Faster than manual' },
]

export default function AIAutomationPage() {
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
            <Bot className="w-4 h-4" />
            AI Automation & Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            AI That Works<br />
            <span className="gradient-text-saffron">While You Sleep</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            From voice calling agents at just ₹6/min to recruiter AI at ₹2/lead — we make AI automation accessible, affordable, and powerful.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Start Automating</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#services" className="btn-outline">
              <span>View Solutions</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center"
              >
                <stat.icon className="w-5 h-5 text-saffron-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Solutions</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Our AI <span className="gradient-text-saffron">Arsenal</span>
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
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center group-hover:bg-saffron-500/20 transition-colors">
                    <service.icon className="w-6 h-6 text-saffron-500" />
                  </div>
                  {service.price && (
                    <span className="text-saffron-400 font-bold text-lg">{service.price}</span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500/60" />
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/50 to-transparent" />
            <Headphones className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Automate?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Tell us about your business and we&apos;ll build a custom AI solution that saves time and money.
            </p>
            <Link href="/contact" className="btn-primary">
              <span>Book a Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
