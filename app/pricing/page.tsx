'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Layers,
  MessageCircle,
  Receipt,
  Repeat,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react'
import { event as gtagEvent } from '@/lib/gtag'
import { PRICE_RANGE, pricingFaqs } from '@/lib/pricing'

const priceDrivers = [
  {
    icon: Sparkles,
    title: 'Skills',
    description: 'The craft and the stack: a React engineer, a performance marketer, a legal researcher. A rarer skill set moves the figure up the range.',
  },
  {
    icon: BadgeCheck,
    title: 'Experience',
    description: 'Years in the role and the seniority the work needs. More experience, and a record of doing this exact job before, sit higher in the range.',
  },
  {
    icon: Layers,
    title: 'The work',
    description: 'The scope of the brief: how many systems or channels the expert owns and the outcomes you expect. A wider brief costs more than a focused one.',
  },
]

const included = [
  { icon: Users, title: 'Vetting and a shortlist of 2-3 profiles', description: 'We hand-pick and vet 2-3 professionals for your role. You interview them and choose.' },
  { icon: ClipboardCheck, title: 'Onboarding into your tools', description: 'Your expert joins your Slack, WhatsApp, Notion or project tools and your standups, and works as part of your team.' },
  { icon: CalendarCheck, title: 'Weekly reviews and monthly reports', description: 'Progress reported every week and summed up every month, in the numbers your business runs on.' },
  { icon: MessageCircle, title: 'One accountable point of contact', description: 'One person at AnantaSutra is accountable for the engagement from day one.' },
  { icon: ShieldCheck, title: '48-hour replacement guarantee', description: 'If the fit fails, a vetted replacement is in the seat within 48 hours.' },
  { icon: Repeat, title: 'Pause or scale as needed', description: 'Start with one expert, add more as you grow, pause without penalty.' },
]

const billing = [
  { icon: Receipt, title: 'One monthly invoice per expert', description: 'The invoice carries the fixed monthly price you agreed. No recruitment fee, no extra fees.' },
  { icon: Wallet, title: 'Salary-style monthly billing', description: 'You pay for your expert the way you would pay a team member: a fixed amount each month, not hours on a timesheet.' },
  { icon: Clock, title: 'Month to month, no lock-in', description: 'Each month you decide whether to continue; you can pause or stop without penalty.' },
]

const comparisonColumns = ['Dedicated expert', 'Freelancer', 'Agency', 'In-house hire']

const comparison = [
  {
    label: 'Continuity',
    cells: [
      'The same person month after month; if the fit fails, a vetted replacement within 48 hours.',
      'Depends on the individual\'s availability between projects.',
      'An account team; the people on your work can change.',
      'High once hired; a resignation restarts the search.',
    ],
  },
  {
    label: 'Who does the work',
    cells: [
      'A vetted specialist who works only for you, inside your team.',
      'The freelancer, usually alongside other clients.',
      'A team shared across the agency\'s clients.',
      'Your employee, full time.',
    ],
  },
  {
    label: 'Management time',
    cells: [
      'Low: one accountable point of contact, weekly reviews, monthly reports.',
      'You brief, review and follow up yourself.',
      'Briefs and approvals go through an account manager.',
      'Hiring, onboarding and managing are all on you.',
    ],
  },
  {
    label: 'Commitment',
    cells: [
      'Month to month, no lock-in; pause or scale as needed.',
      'Per project; ends when the project does.',
      'Usually a retainer; terms vary by agency.',
      'Full-time employment, with notice periods on both sides.',
    ],
  },
]

const readMore = [
  { href: '/blog/cost-hire-dedicated-developer-india', title: 'How much does it cost to hire a dedicated developer in India?' },
  { href: '/blog/hourly-vs-monthly-pricing-remote-expert', title: 'Hourly rate or fixed monthly price: which is better?' },
  { href: '/blog/dedicated-expert-vs-freelancer-vs-agency', title: 'Dedicated expert vs freelancer vs agency: which should you hire?' },
]

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

const trackCta = (placement: string) =>
  gtagEvent('pricing_cta_click', { placement, cta: 'book_free_consultation' })

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <motion.div {...fadeUp} className="text-center mb-12">
      <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">{eyebrow}</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-white">{title}</h2>
      {intro && <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">{intro}</p>}
    </motion.div>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero: the answer first */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-saffron-500/5 blur-[120px]" />
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-sm font-medium mb-6"
            >
              <Wallet className="w-4 h-4" />
              Pricing
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-6xl font-bold mb-6"
            >
              Dedicated expert <span className="gradient-text-saffron">pricing</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8"
            >
              <span className="text-white font-semibold">One fixed monthly price per dedicated expert, from {PRICE_RANGE.minLabel} to {PRICE_RANGE.maxLabel} a month</span>, depending on the expert&apos;s skills, experience and the work. No extra fees, no recruitment fee, no lock-in. Your expert is vetted, works only for you inside your team, and is <span className="text-white font-semibold">live in about 7 days</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/contact" className="btn-primary" onClick={() => trackCta('hero')}>
                <span>Book a free consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services/dedicated-experts" className="btn-outline">
                <span>How dedicated experts work</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 glass-card rounded-3xl p-8 glow-saffron"
          >
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-4">One fixed monthly price</p>
            <p className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              {PRICE_RANGE.minLabel}
              <span className="text-gray-500 text-2xl md:text-3xl font-normal"> to </span>
              {PRICE_RANGE.maxLabel}
            </p>
            <p className="text-gray-400 mt-2 mb-6">per dedicated expert, a month</p>
            <ul className="space-y-3">
              {['No extra fees', 'No recruitment fee', 'No lock-in'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-200 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* What decides the price */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="The range"
            title="What decides the price"
            intro={`Every dedicated expert sits somewhere between ${PRICE_RANGE.minLabel} and ${PRICE_RANGE.maxLabel} a month. Three things decide where.`}
          />
          <div className="grid md:grid-cols-3 gap-6">
            {priceDrivers.map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} className="text-center text-gray-400 text-lg mt-10 max-w-3xl mx-auto">
            We publish the range rather than a rate card per role: the same title can cover very different briefs. Tell us the role on a free consultation and we come back with <span className="text-white font-semibold">one fixed monthly figure inside this range</span>, before you commit to anything.
          </motion.p>
        </div>
      </section>

      {/* What is included */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Included"
            title="What is included"
            intro="The monthly price covers the expert and the way we run the engagement around them."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How billing works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading eyebrow="Billing" title="How billing works" />
          <div className="grid md:grid-cols-3 gap-6">
            {billing.map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-saffron-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compared with the alternatives: qualitative only */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="The alternatives"
            title="Compared with a freelancer, an agency or hiring in-house"
            intro="Four ways to get the work done, compared on how they run rather than on what they charge."
          />
          <motion.div {...fadeUp} className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="p-4 text-gray-500 text-xs font-medium uppercase tracking-wider">Compared on</th>
                    {comparisonColumns.map((column, i) => (
                      <th key={column} scope="col" className={`p-4 font-semibold ${i === 0 ? 'text-saffron-400 bg-saffron-500/5' : 'text-white'}`}>
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label} className="border-b border-white/5 last:border-0 align-top">
                      <th scope="row" className="p-4 text-white font-medium whitespace-nowrap">{row.label}</th>
                      {row.cells.map((cell, i) => (
                        <td key={comparisonColumns[i]} className={`p-4 leading-relaxed ${i === 0 ? 'text-gray-200 bg-saffron-500/5' : 'text-gray-400'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ: every answer is in the HTML, matching the FAQPage JSON-LD in layout.tsx */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="FAQ" title="Questions about pricing" />
          <div className="space-y-3">
            {pricingFaqs.map((faq, i) => (
              <motion.div key={faq.q} {...fadeUp} transition={{ delay: i * 0.05 }}>
                <details className="group glass-card rounded-xl" open={i === 0}>
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <h3 className="text-white font-medium">{faq.q}</h3>
                    <ChevronDown className="w-4 h-4 text-saffron-500 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp} className="glass-card rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/50 to-transparent" />
            <UserCheck className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Book a free consultation</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              A 30-minute call about the role you need. We come back with 2-3 vetted profiles and one fixed monthly figure inside the range. You interview and choose.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-primary" onClick={() => trackCta('footer')}>
                <span>Book a free consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services/dedicated-experts" className="btn-outline">
                <span>How dedicated experts work</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Read more */}
      <section className="py-12 px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="font-display text-2xl font-bold text-white mb-6">
            Read more
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-4">
            {readMore.map((post, i) => (
              <motion.div key={post.href} {...fadeUp} transition={{ delay: i * 0.08 }}>
                <Link href={post.href} className="glass-card rounded-xl p-5 flex items-start gap-3 group h-full">
                  <BookOpen className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">{post.title}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
