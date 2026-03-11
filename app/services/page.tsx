'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Brain, Megaphone, BookOpen, ShoppingBag, Building2,
  Globe, Briefcase, GraduationCap, ArrowRight, Phone,
  Video, Share2, Mail, Target, Users, Camera, Palette,
  BarChart3, Sparkles
} from 'lucide-react'

const activeServices = [
  {
    id: 'ai-automation',
    title: 'AI Automation & Intelligence',
    description: 'Transform your business with AI-powered solutions at unbeatable prices. From voice calling agents to intelligent marketing tools.',
    icon: Brain,
    accent: 'saffron',
    href: '/services/ai-automation',
    features: [
      { icon: Phone, label: 'Voice Calling Agents', detail: 'Starting at ₹6/min' },
      { icon: Video, label: 'AI Video Generators', detail: 'For Real Estate & more' },
      { icon: Share2, label: 'Social Media Automation', detail: 'Full autopilot' },
      { icon: Mail, label: 'Gmail Automation', detail: 'Smart workflows' },
      { icon: Target, label: 'AI Marketing Tools', detail: 'Data-driven campaigns' },
      { icon: Users, label: 'Recruiter AI', detail: '₹2/lead' },
    ],
  },
  {
    id: 'marketing',
    title: 'Creative & Marketing Agency',
    description: 'End-to-end marketing support from shooting to social media management. We amplify your brand across every channel.',
    icon: Megaphone,
    accent: 'violet',
    href: '/services/marketing',
    features: [
      { icon: Camera, label: 'Professional Shooting', detail: 'Photo & Video' },
      { icon: Palette, label: 'Content Creation', detail: 'Design & Copy' },
      { icon: Share2, label: 'Social Media Management', detail: 'All platforms' },
      { icon: BarChart3, label: 'Brand Strategy', detail: 'Growth focused' },
      { icon: Target, label: 'Performance Marketing', detail: 'ROI driven' },
      { icon: Sparkles, label: 'Creative Direction', detail: 'Unique identity' },
    ],
  },
]

const comingSoonServices = [
  { title: 'E-Commerce', icon: ShoppingBag, description: 'Online store solutions' },
  { title: 'Real Estate', icon: Building2, description: 'Property & investment' },
  { title: 'Immigration Support', icon: Globe, description: 'Global mobility assistance' },
  { title: 'Business Solutions', icon: Briefcase, description: 'End-to-end consulting' },
  { title: 'Academic Solutions', icon: GraduationCap, description: 'Education & upskilling' },
]

export default function ServicesPage() {
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
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-4"
          >
            Our Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            What We <span className="gradient-text-saffron">Build</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Every thread in the AnantaSutra tapestry carries purpose — from AI-powered automation to creative marketing solutions.
          </motion.p>
        </div>
      </section>

      {/* Active Services */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-24">
          {activeServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
            >
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
                  service.accent === 'saffron'
                    ? 'bg-saffron-500/10 text-saffron-400 border border-saffron-500/20'
                    : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                }`}>
                  <service.icon className="w-3.5 h-3.5" />
                  Active
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  {service.title}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  {service.description}
                </p>
                <Link href={service.href} className="btn-primary inline-flex">
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className={`grid grid-cols-2 gap-4 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                {service.features.map((feature, fi) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: fi * 0.1 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <feature.icon className={`w-5 h-5 mb-2 ${
                      service.accent === 'saffron' ? 'text-saffron-500' : 'text-violet-500'
                    }`} />
                    <p className="text-white text-sm font-medium">{feature.label}</p>
                    <p className="text-gray-500 text-xs mt-1">{feature.detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto my-16" />

      {/* Coming Soon */}
      <section className="py-16 px-4 mb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-3">
              Expanding Universe
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Coming <span className="gradient-text-violet">Soon</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {comingSoonServices.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 text-center relative overflow-hidden group"
              >
                <div className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  Soon
                </div>
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-dark-400/50 flex items-center justify-center group-hover:bg-violet-500/10 transition-colors">
                  <item.icon className="w-6 h-6 text-gray-500 group-hover:text-violet-400 transition-colors" />
                </div>
                <h3 className="text-white text-sm font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
