'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  BookOpen, Sun, ArrowRight, Sparkles, Heart,
  Calendar, Bell, CheckCircle2, Globe2, BookMarked,
  Scroll, Users, Download, Star,
  Phone, Mic, BarChart2, Zap, Database, HeadphoneOff
} from 'lucide-react'

const apps = [
  {
    id: 'granthas',
    name: 'Granthas',
    tagline: 'All Hindu Scriptures, One Place',
    description: 'A comprehensive digital library of Hindu scriptures, texts, and wisdom literature. From the Vedas to the Puranas, from the Upanishads to the Bhagavad Gita — access thousands of years of sacred knowledge beautifully formatted and searchable.',
    accent: 'saffron',
    icon: BookOpen,
    features: [
      { icon: Scroll, label: 'Complete Vedas, Upanishads, Puranas' },
      { icon: BookMarked, label: 'Bhagavad Gita with commentary' },
      { icon: Globe2, label: 'Multiple language support' },
      { icon: Star, label: 'Daily verse & wisdom quotes' },
      { icon: Users, label: 'Community discussions' },
      { icon: Download, label: 'Offline reading mode' },
    ],
    status: 'In Development',
  },
  {
    id: 'ritualist',
    name: 'Ritualist',
    tagline: 'Your Free Daily Companion',
    description: 'A free app designed to help you build and maintain daily rituals and habits. Track your routines, set reminders, and build a life of intentional practice — from morning meditation to evening reflection.',
    accent: 'violet',
    icon: Sun,
    features: [
      { icon: Calendar, label: 'Daily routine tracker' },
      { icon: Bell, label: 'Smart reminders & nudges' },
      { icon: CheckCircle2, label: 'Habit streak tracking' },
      { icon: Heart, label: 'Wellness check-ins' },
      { icon: Star, label: 'Progress analytics' },
      { icon: Users, label: 'Community challenges' },
    ],
    status: 'Free',
    liveUrl: 'https://ritualist.anantasutra.com',
  },
  {
    id: 'sanchar',
    name: 'Sanchar',
    tagline: 'Voice AI for Indian Businesses',
    description: 'Sanchar (संचार) is a multi-tenant Voice AI Platform built for Indian businesses. Deploy AI-powered voice agents that make and receive phone calls — fully automated, no human agent needed. Think of it as a programmable call center where the "agent" is an AI that understands speech, thinks, and responds in real time — in Hindi, English, and mixed.',
    accent: 'cyan',
    icon: Phone,
    features: [
      { icon: Mic, label: 'Conversational AI voice agents' },
      { icon: Zap, label: 'Outbound auto-dial campaigns' },
      { icon: HeadphoneOff, label: 'Inbound AI — no human needed' },
      { icon: BarChart2, label: 'Call analytics & sentiment scores' },
      { icon: Database, label: 'Knowledge base from PDFs & URLs' },
      { icon: Globe2, label: 'Hindi + English (Hinglish) support' },
    ],
    status: 'In Development',
    liveUrl: 'https://sanchar.anantasutra.com',
  },
]

const NamasteSvg = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
    <path d="M60 10C55 10 50 25 48 35C46 45 46 55 48 60C50 65 52 68 55 72L56 85C56 90 58 95 60 95C62 95 64 90 64 85L65 72C68 68 70 65 72 60C74 55 74 45 72 35C70 25 65 10 60 10Z" fill="url(#namaste-gradient)" fillOpacity="0.15" stroke="#E8A317" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M48 60C44 58 38 55 35 52C32 49 30 46 32 43C34 40 38 42 40 44C42 46 44 50 46 54" stroke="#E8A317" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M72 60C76 58 82 55 85 52C88 49 90 46 88 43C86 40 82 42 80 44C78 46 76 50 74 54" stroke="#E8A317" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M44 40L42 30C41 26 42 22 45 22C48 22 49 26 48 30L48 35" stroke="#E8A317" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M76 40L78 30C79 26 78 22 75 22C72 22 71 26 72 30L72 35" stroke="#E8A317" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="60" cy="18" r="2" fill="#E8A317" fillOpacity="0.6"/>
    <path d="M52 105C52 105 56 100 60 100C64 100 68 105 68 105" stroke="#E8A317" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4"/>
    <defs>
      <linearGradient id="namaste-gradient" x1="48" y1="10" x2="72" y2="95" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E8A317"/>
        <stop offset="1" stopColor="#6A3DE8"/>
      </linearGradient>
    </defs>
  </svg>
)

export default function AppsPage() {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Wisdom & Lifestyle
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Apps for <span className="gradient-text-divine">Mindful Living</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Technology that nurtures the soul. Ancient wisdom and modern tools for a life of purpose and practice.
          </motion.p>
        </div>
      </section>

      {/* Apps */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-32">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 ${
                  app.accent === 'saffron'
                    ? 'bg-saffron-500/10 text-saffron-400 border border-saffron-500/20'
                    : app.accent === 'cyan'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                }`}>
                  {app.status}
                </div>

                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                  {app.name}
                </h2>
                <p className={`text-lg font-medium mb-4 ${
                  app.accent === 'saffron' ? 'text-saffron-400' : app.accent === 'cyan' ? 'text-cyan-400' : 'text-violet-400'
                }`}>
                  {app.tagline}
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {app.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {app.liveUrl ? (
                    <a href={app.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      <span>Visit App</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link href="/contact" className="btn-primary">
                      <span>Get Early Access</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Features Card */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className={`glass-card rounded-3xl p-8 relative overflow-hidden ${
                  app.accent === 'saffron' ? 'glow-saffron' : app.accent === 'cyan' ? 'glow-cyan' : 'glow-violet'
                }`}>
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] ${
                    app.accent === 'saffron'
                      ? 'bg-gradient-to-r from-transparent via-saffron-500/50 to-transparent'
                      : app.accent === 'cyan'
                      ? 'bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-violet-500/50 to-transparent'
                  }`} />

                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    app.accent === 'saffron' ? 'bg-saffron-500/10' : app.accent === 'cyan' ? 'bg-cyan-500/10' : 'bg-violet-500/10'
                  }`}>
                    <app.icon className={`w-8 h-8 ${
                      app.accent === 'saffron' ? 'text-saffron-500' : app.accent === 'cyan' ? 'text-cyan-500' : 'text-violet-500'
                    }`} />
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-6">Key Features</h3>

                  <div className="space-y-4">
                    {app.features.map((feature, fi) => (
                      <motion.div
                        key={feature.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: fi * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <feature.icon className={`w-5 h-5 flex-shrink-0 ${
                          app.accent === 'saffron' ? 'text-saffron-500' : app.accent === 'cyan' ? 'text-cyan-500' : 'text-violet-500'
                        }`} />
                        <span className="text-gray-300 text-sm">{feature.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/30 to-transparent" />

            <NamasteSvg />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Journey
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
              Be among the first to experience apps that bridge ancient wisdom with modern technology.
            </p>
            <Link href="/contact" className="btn-primary">
              <span>Get Notified</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
