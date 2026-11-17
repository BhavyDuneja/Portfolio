'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Bot, Phone, Mic, BarChart3, Globe2, Clock, Zap,
  IndianRupee, ArrowRight, Headphones, Quote,
  ShoppingBag, HeartPulse, Building2, Users, GraduationCap, Hotel
} from 'lucide-react'
import ServiceFaq, { type Faq } from '@/components/anantasutra/ServiceFaq'

const useCases = [
  { icon: ShoppingBag, title: 'D2C & E-Commerce', description: 'COD confirmation, order updates, cart recovery, post-purchase surveys' },
  { icon: HeartPulse, title: 'Healthcare', description: 'Appointment booking and reminders, follow-up calls, patient feedback collection' },
  { icon: Building2, title: 'Real Estate', description: 'Lead qualification, site visit scheduling, property inquiry handling' },
  { icon: Users, title: 'Collections & Lending', description: 'Payment reminders, EMI follow-ups, loan closure communication' },
  { icon: GraduationCap, title: 'Education & Ed-Tech', description: 'Admission enquiries, counselling-call booking, fee reminders, demo-class follow-ups' },
  { icon: Hotel, title: 'Hospitality', description: 'Booking confirmations, reservation changes, pre-arrival calls, guest feedback' },
]

const features = [
  { icon: Mic, label: 'Human-like voice', detail: 'Natural speech with Indian accent support' },
  { icon: Globe2, label: 'Multi-language', detail: 'Hindi, English, Hinglish and more' },
  { icon: Clock, label: '24/7 availability', detail: 'Never misses a call, any time zone' },
  { icon: BarChart3, label: 'Real-time analytics', detail: 'Call outcomes, sentiment, transcripts' },
  { icon: Zap, label: '<1s response latency', detail: 'No awkward pauses in conversation' },
  { icon: Bot, label: 'Custom personas', detail: 'Brand voice, script, and tone control' },
]

const stats = [
  { value: '₹6', suffix: '/min', label: 'Flat pricing, no hidden fees' },
  { value: '24/7', suffix: '', label: 'Always-on voice agent' },
  { value: '<1s', suffix: '', label: 'Response latency' },
  { value: '10+', suffix: '', label: 'Languages supported' },
]

const steps = [
  { step: '01', title: 'Tell us which calls', description: 'Inbound, outbound or both: the calls you want handled, the script, the language and what a good outcome looks like.' },
  { step: '02', title: 'We build your agent', description: 'We write the script and set the persona, voice and tone to your brand. You hear a demo call with your own agent within 48 hours.' },
  { step: '03', title: 'Connect your systems', description: 'Call outcomes flow into your CRM, Google Sheets or WhatsApp, or any other system you already use.' },
  { step: '04', title: 'Go live and review', description: 'Every call comes with a transcript, an outcome and sentiment, so you see what callers ask and can tune the script.' },
]

// Prices as the site states them everywhere else: ₹6 per talk-time minute, volume pricing above 10,000 minutes a month.
const pricing = [
  { item: 'Talk time', detail: '₹6 per minute, charged only while the agent is on a call' },
  { item: 'Setup fee', detail: 'None' },
  { item: 'Monthly minimum', detail: 'None. Scale up or down anytime' },
  { item: '10,000+ minutes a month', detail: 'Volume pricing on request' },
  { item: 'Demo', detail: 'Free: a demo call with your own agent within 48 hours' },
]

const comparison = {
  columns: ['AI voice agent', 'In-house calling team', 'IVR menu'],
  rows: [
    { label: 'Availability', values: ['24/7, nights and holidays too', 'Office hours and shifts', '24/7'] },
    { label: 'Calls at once', values: ['100+ simultaneous calls', 'One per person on the team', 'Many, but callers press keys'] },
    { label: 'Conversation', values: ['Natural two-way speech in Hindi, English and Hinglish', 'Natural, in the languages your team speaks', 'Recorded prompts and keypad menus'] },
    { label: 'Cost', values: ['₹6 per talk-time minute', 'Salaries, hiring, training and attrition', 'Line and platform fees'] },
    { label: 'Call records', values: ['Transcript, outcome and sentiment for every call', 'Whatever the caller writes down', 'Keypress logs'] },
    { label: 'Best for', values: ['High-volume, repetitive calls', 'Calls that need judgement or negotiation', 'Simple call routing'] },
  ],
}

const faqs: Faq[] = [
  {
    question: 'How much does an AI voice agent cost in India?',
    answer: '₹6 per minute of talk time. You pay only for the minutes the agent is on a call, with no setup fee and no monthly minimum, and volume pricing is available above 10,000 minutes a month. For example, 1,000 calls a month at about 2 minutes each comes to 2,000 minutes, or ₹12,000.',
  },
  {
    question: 'Can the AI voice agent speak Hindi and Hinglish?',
    answer: 'Yes. The agents speak Hindi, English and Hinglish, plus several regional languages. We set the language, voice and tone to match your callers and your brand.',
  },
  {
    question: 'Can it make outbound calls as well as answer inbound calls?',
    answer: 'Yes, both. It answers inbound calls and makes outbound ones: appointment booking and reminders, lead qualification, COD confirmation, payment and EMI reminders, follow-ups and surveys.',
  },
  {
    question: 'How many calls can it handle at once?',
    answer: 'More than 100 simultaneous calls, 24/7, so callers are not left waiting at peak hours or after office hours.',
  },
  {
    question: 'Does it work with my CRM?',
    answer: 'Yes. Call outcomes and transcripts can go into your CRM, Google Sheets, WhatsApp or any other system you use.',
  },
  {
    question: 'How fast can we try it?',
    answer: 'We set up a demo call with your own AI voice agent within 48 hours, with no commitment.',
  },
  {
    question: 'When is a person better than an AI voice agent?',
    answer: 'For calls that need judgement, negotiation or a long relationship, a person does better. Many clients use both: an AI voice agent for high-volume, repetitive calls and a dedicated expert for the rest.',
    guide: { href: '/services/dedicated-experts', label: 'Hire a dedicated expert' },
  },
]

export default function VoiceAgentsPage() {
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
            <Phone className="w-4 h-4" />
            Built for Indian businesses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            AI Voice Calling Agents.<br />
            <span className="gradient-text-saffron">Calls Handled at ₹6/min.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10"
          >
            Deploy AI voice agents that make and receive phone calls 24/7 in Hindi, English and Hinglish — with human-like conversation, real-time transcripts, and full analytics. No hiring, no salaries, no off days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="btn-primary">
              <span>Book a Free Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#pricing" className="btn-outline">
              <span>See Pricing</span>
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
              <p className="text-3xl font-bold text-white">{stat.value}<span className="text-saffron-400">{stat.suffix}</span></p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Capabilities</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
              Built for <span className="gradient-text-saffron">Indian Businesses</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 group"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mb-4 group-hover:bg-saffron-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{f.label}</h3>
                <p className="text-gray-400 text-sm">{f.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Your AI Voice Agent, <span className="gradient-text-saffron">Live in Four Steps</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <p className="font-display text-3xl font-bold gradient-text-saffron mb-3">{s.step}</p>
                <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
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
              Works Across <span className="gradient-text-saffron">Every Industry</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8 flex gap-5 items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center flex-shrink-0">
                  <uc.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{uc.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{uc.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Pricing</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              AI Voice Agent Pricing: <span className="gradient-text-saffron">₹6 per Minute</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <table className="w-full text-left">
              <caption className="sr-only">What the ₹6 per minute price includes</caption>
              <tbody>
                {pricing.map((row) => (
                  <tr key={row.item} className="border-b border-white/5 last:border-0">
                    <th scope="row" className="px-6 py-4 text-white font-semibold align-top w-2/5">{row.item}</th>
                    <td className="px-6 py-4 text-gray-400">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 mt-6 flex flex-col md:flex-row items-center gap-6"
          >
            <IndianRupee className="w-10 h-10 text-saffron-500 flex-shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-white font-bold text-xl mb-1">A worked example</h3>
              <p className="text-gray-400">1,000 calls a month at about 2 minutes each is 2,000 minutes of talk time: ₹12,000 a month, with nothing else on the bill.</p>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap flex-shrink-0">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Compare</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              AI Voice Agent vs <span className="gradient-text-saffron">Calling Team vs IVR</span>
            </h2>
          </motion.div>

          <div className="glass-card rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="px-5 py-4"><span className="sr-only">Compared on</span></th>
                  {comparison.columns.map((col, i) => (
                    <th key={col} scope="col" className={`px-5 py-4 font-semibold ${i === 0 ? 'text-saffron-400' : 'text-white'}`}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.label} className="border-b border-white/5 last:border-0">
                    <th scope="row" className="px-5 py-4 text-white font-semibold align-top">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td key={i} className={`px-5 py-4 align-top ${i === 0 ? 'text-gray-200' : 'text-gray-400'}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-400 text-center mt-6">
            Calls that need judgement are better with a person.{' '}
            <Link href="/services/dedicated-experts" className="text-saffron-400 hover:underline">Hire a dedicated expert</Link>{' '}
            for those, and let the AI agent take the volume.
          </p>
        </div>
      </section>

      {/* Proof */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 flex gap-5 items-start"
          >
            <Quote className="w-8 h-8 text-saffron-500 flex-shrink-0" />
            <div>
              <h2 className="text-white font-bold text-xl mb-2">In use: Giant Migrations, Qatar and UAE</h2>
              <p className="text-gray-400 leading-relaxed">
                For this immigration firm, which handles high volumes of enquiries across two countries, we deployed AI voice agents to take first-touch enquiries and qualify them, alongside a new website and automated handling of legal matters.{' '}
                <Link href="/portfolio" className="text-saffron-400 hover:underline">See the case study</Link>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <ServiceFaq
        faqs={faqs}
        accent="saffron"
        heading={<>AI voice agent <span className="gradient-text-saffron">questions</span></>}
      />

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
              Ready to Deploy Your First Agent?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              We&apos;ll set up a demo call with your own AI agent in 48 hours. No commitment needed.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <span>Book Free Demo</span>
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
