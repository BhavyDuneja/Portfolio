'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  UserCheck, Users, Code2, Megaphone, PenTool, TrendingUp,
  HeartHandshake, ArrowRight, CheckCircle2, Briefcase, Clock,
  ShieldCheck, Target, Rocket, Sparkles, Wallet, BadgePercent, Receipt
} from 'lucide-react'

const expertRoles = [
  { icon: Code2, title: 'Full-Stack Engineers', description: 'React, Next.js, Node, Python, DevOps — embedded into your team for sprint-based delivery' },
  { icon: Megaphone, title: 'Performance Marketers', description: 'Google, Meta & LinkedIn ads specialists who own your paid growth end-to-end' },
  { icon: PenTool, title: 'Content & Design', description: 'Copywriters, graphic designers, video editors producing daily brand content' },
  { icon: TrendingUp, title: 'Growth Strategists', description: 'Funnel experts, analytics pros, CRO specialists who own your revenue KPIs' },
  { icon: Users, title: 'Social Media Managers', description: 'Daily posting, engagement, community management across all platforms' },
  { icon: Briefcase, title: 'Project Managers', description: 'Senior PMs who coordinate, plan sprints, and keep everything on track' },
]

const howItWorks = [
  { step: '01', title: 'Tell us your need', description: 'A 30-minute call to understand your business, the role you need, and the outcomes you want.' },
  { step: '02', title: 'We match & vet', description: 'We handpick 2-3 vetted professionals from our network who match your requirements. You interview them.' },
  { step: '03', title: 'They join your team', description: 'Your chosen expert joins your Slack / Notion / project tools and starts working as part of your team within 7 days.' },
  { step: '04', title: 'You stay focused', description: 'Weekly reviews, monthly reports, and one accountable point-of-contact. You focus on business, they deliver the work.' },
]

const whyThisModel = [
  { icon: Target, title: 'Dedicated, not shared', description: 'Your expert works only on your business — not juggling 5 clients at once.' },
  { icon: Clock, title: 'Ramp-up in 7 days', description: 'Skip the 3-month hiring cycle. Your expert is productive from week one.' },
  { icon: ShieldCheck, title: 'Replace anytime', description: 'If the fit isn\'t right, we replace them within 48 hours. No long contracts.' },
  { icon: Rocket, title: 'Scale on demand', description: 'Start with one expert. Add more as you grow. Pause when you don\'t need them.' },
  { icon: Sparkles, title: 'Backed by AnantaSutra', description: 'Every expert has AnantaSutra\'s AI tools, processes, and leadership behind them.' },
  { icon: HeartHandshake, title: 'Partnership mindset', description: 'We grow when you grow. That\'s the whole reason this model exists.' },
]

const stats = [
  { value: 'Just', suffix: ' Salary', label: 'No agency markup, no hidden fees' },
  { value: '7', suffix: ' days', label: 'From signup to first day of work' },
  { value: '48h', suffix: '', label: 'Replacement guarantee' },
  { value: '100%', suffix: '', label: 'Dedicated to your business' },
]

const pricingBreakdown = [
  { icon: Wallet, title: 'What You Pay', description: 'The expert\'s monthly salary — exactly what they earn. That\'s it.', highlight: true },
  { icon: BadgePercent, title: 'What You Don\'t Pay', description: 'No agency markup (30-50% saved). No recruitment fees. No overheads. No hidden charges.' },
  { icon: Receipt, title: 'How We Make Money', description: 'A small, transparent coordination fee — separately agreed upfront. You see every rupee.' },
]

export default function DedicatedExpertsPage() {
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
            <UserCheck className="w-4 h-4" />
            Dedicated Experts On Demand
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Not a project.<br />
            <span className="gradient-text-violet">A dedicated expert.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            We don&apos;t just take your project and disappear. We assign a full-time engineer, marketer, or designer who works exclusively on your business — and you pay <span className="text-white font-semibold">just their salary</span>. No markup. No hidden fees. Just a team member who helps you grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Get Your Expert</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#roles" className="btn-outline">
              <span>See Available Roles</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <p className="text-3xl font-bold text-white">{stat.value}<span className="text-violet-400">{stat.suffix}</span></p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Core Pitch */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 md:p-14 text-center"
          >
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-4">The Difference</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              You run your business.<br />
              <span className="gradient-text-violet">Your expert runs your execution.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Most agencies sell you deliverables. We sell you a dedicated person who becomes part of your team.
              They attend your standups, know your product, and care about your KPIs — because they&apos;re not splitting time across 10 clients.
              <br /><br />
              <span className="text-white font-semibold">That&apos;s how real growth happens — together.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Expert Roles */}
      <section id="roles" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-violet-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Available Roles</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Pick Your <span className="gradient-text-violet">Dedicated Expert</span>
            </h2>
            <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
              Whatever your business needs — we have vetted, experienced professionals ready to join your team.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertRoles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group hover:border-violet-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                  <role.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{role.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-violet-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">How It Works</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              From Need to <span className="gradient-text-violet">Fully Onboarded</span> in 7 Days
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 relative"
              >
                <div className="text-5xl font-bold gradient-text-violet mb-3">{step.step}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Model */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-violet-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Why It Works</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Built for <span className="gradient-text-violet">Founders Who Value Time</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyThisModel.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — The Big Differentiator */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-violet-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Pricing</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              You Pay <span className="gradient-text-violet">Just the Salary.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              No agency markup. No recruitment fees. No overheads. You pay what your expert earns — nothing more, nothing hidden.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {pricingBreakdown.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-6 ${item.highlight ? 'border-violet-500/40 bg-violet-500/5' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.highlight ? 'bg-violet-500/20' : 'bg-violet-500/10'}`}>
                  <item.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-10 border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-transparent"
          >
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <CheckCircle2 className="w-12 h-12 text-violet-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl md:text-2xl mb-2">Why This Model? Because It&apos;s Actually Fair.</h3>
                <p className="text-gray-400 leading-relaxed">
                  Traditional agencies mark up talent by <span className="text-white font-semibold">30-50%</span> — you pay ₹1.5L for someone earning ₹1L. We flipped it.
                  You pay the salary, we earn a transparent coordination fee. Everyone wins, and you save lakhs every year.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grow Together Callout */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
          >
            <HeartHandshake className="w-12 h-12 text-violet-400 flex-shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-bold text-2xl mb-1">Grow Together — That&apos;s the Whole Point.</h3>
              <p className="text-gray-400">We don&apos;t just execute. We become part of your journey. When you win, we win — and that&apos;s exactly how we approach every engagement.</p>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap flex-shrink-0">
              <span>Let&apos;s Talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
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
            <UserCheck className="w-10 h-10 text-violet-400 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Stop Juggling. Start Growing.
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Tell us which role you need — we&apos;ll introduce you to your dedicated expert within 7 days. Free consultation, zero commitment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Book Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn-outline">
                <span>All Services</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
