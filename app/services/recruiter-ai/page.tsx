'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search, Users, ArrowRight, CheckCircle2,
  IndianRupee, FileText, Mail, Zap, Target,
  BarChart3, Filter, Briefcase
} from 'lucide-react'

const whoIsItFor = [
  { icon: Briefcase, title: 'Hiring Managers', description: 'Find qualified candidates faster without spending hours on job boards.' },
  { icon: Users, title: 'Staffing Agencies', description: 'Scale your candidate pipeline 10x without hiring more recruiters.' },
  { icon: Target, title: 'Job Seekers', description: 'Find the right opportunities and get your application in front of decision-makers.' },
  { icon: Zap, title: 'Startups', description: 'Build your team fast with AI-screened candidates delivered to your inbox.' },
]

const features = [
  {
    icon: Search,
    title: 'Boolean Search Generation',
    description: 'AI builds complex Boolean search strings for LinkedIn, Naukri, and Indeed — finding candidates you\'d never find manually.',
    items: ['Advanced Boolean logic', 'Multi-platform search', 'Skills & experience filters', 'Location targeting'],
  },
  {
    icon: FileText,
    title: 'Resume Parsing & Matching',
    description: 'Upload JDs and bulk resumes — AI matches candidates to roles with a fit score and reasoning.',
    items: ['JD-to-resume matching', 'Fit score (0–100)', 'Skills gap analysis', 'Bulk processing'],
  },
  {
    icon: Mail,
    title: 'Cold Outreach Automation',
    description: 'Personalized cold emails sent to matched candidates at scale — with follow-up sequences built in.',
    items: ['Hyper-personalized emails', 'LinkedIn + email outreach', 'Multi-step follow-ups', 'Reply detection'],
  },
  {
    icon: BarChart3,
    title: 'Lead Enrichment',
    description: 'AI enriches candidate profiles with verified contact info, LinkedIn, GitHub, and professional history.',
    items: ['Email verification', 'LinkedIn profile lookup', 'Work history enrichment', 'Contact data export'],
  },
]

export default function RecruiterAIPage() {
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
            <Search className="w-4 h-4" />
            Recruiter AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Hire Smarter.<br />
            <span className="gradient-text-saffron">At ₹2/Lead.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            AI-powered recruitment that finds, qualifies, and connects you with the right candidates or job opportunities — with enriched contact data at just ₹2/lead.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Start Hiring Smarter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#features" className="btn-outline">
              <span>See Features</span>
            </a>
          </motion.div>
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
              <h3 className="text-white font-bold text-2xl mb-1">₹2 per Enriched Lead</h3>
              <p className="text-gray-400">Verified email, LinkedIn profile, work history, and contact data. No monthly subscription — pay only for what you use.</p>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap flex-shrink-0">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Who It&apos;s For</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Built for <span className="gradient-text-saffron">Everyone Who Hires</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whoIsItFor.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-saffron-500/20 transition-colors">
                  <w.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm">{w.description}</p>
              </motion.div>
            ))}
          </div>
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
              Your AI <span className="gradient-text-saffron">Recruiting Engine</span>
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
            <Users className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Find Your Next Great Hire Today
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Share your JD and we&apos;ll deliver a list of matched, enriched candidates within 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Get Candidate List</span>
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
