'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ShieldCheck, Wallet } from 'lucide-react'

// The one price AnantaSutra publishes for a dedicated expert (founder, 2026-10-13): a fixed monthly price per
// expert, ₹20,000 to ₹60,000 a month by skills, experience and the work. Our margin sits inside it, so nothing here
// compares the price with what the expert is paid or with what an agency charges.
const pricingBreakdown = [
  {
    icon: Wallet,
    title: 'What you pay',
    description: 'One fixed monthly price per expert, from ₹20,000 to ₹60,000 a month, depending on the expert\'s skills, experience and the work. The price is said upfront, before the expert starts.',
    highlight: true,
  },
  {
    icon: ShieldCheck,
    title: 'What you don\'t pay',
    description: 'No extra fees. No recruitment fee. No lock-in: the engagement runs month to month, so you can scale up, pause or stop when your business needs change.',
    highlight: false,
  },
]

export default function DedicatedExpertsPricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-violet-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Pricing</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            One fixed monthly price <span className="gradient-text-violet">per expert</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From ₹20,000 to ₹60,000 a month, depending on the expert&apos;s skills, experience and the work. No extra fees, no lock-in.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
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
              <h3 className="text-white font-bold text-xl md:text-2xl mb-2">Want the exact price for your role?</h3>
              <p className="text-gray-400 leading-relaxed">
                Tell us the role and the work in a 30-minute call, and you hear the price before the expert starts.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end flex-shrink-0">
              <Link href="/contact" className="btn-primary">
                <span>Book a free consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="btn-outline">
                <span>See pricing</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
