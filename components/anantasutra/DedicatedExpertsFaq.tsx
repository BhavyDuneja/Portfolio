'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import { SITE_URL } from '@/lib/seo'

interface Faq {
  question: string
  answer: string
  /** The guide that goes deeper: shown under the answer, and part of the answer in the FAQPage schema. */
  guide?: { href: string; label: string }
}

// The searcher's own questions, answered in the site's wording: ₹20,000 to ₹60,000 a month is the only price
// published for a dedicated expert, "about 7 days" and the 48-hour replacement guarantee stay as the site states them.
const faqs: Faq[] = [
  {
    question: 'How much does a dedicated expert cost in India?',
    answer: 'One fixed monthly price, from ₹20,000 to ₹60,000 a month, depending on the expert\'s skills, experience and the work. No extra fees, no recruitment fee, no lock-in. The price is said upfront, before the expert starts.',
    guide: { href: '/blog/cost-hire-dedicated-developer-india', label: 'What a dedicated developer costs in India' },
  },
  {
    question: 'What is a dedicated expert, and how is it different from staff augmentation or resource augmentation?',
    answer: 'Buyers often search for "staff augmentation" or "resource augmentation"; both mean adding outside people to your team for a period. A dedicated expert is one vetted specialist who works only for your business, inside your tools and standups, for one fixed monthly price and with no lock-in. You interview and choose the person, and they report to you.',
    guide: { href: '/blog/staff-augmentation-vs-dedicated-expert', label: 'Staff augmentation vs a dedicated expert' },
  },
  {
    question: 'Can I hire AI experts in India this way?',
    answer: 'Yes. AI engineers, machine-learning specialists and automation experts are among the roles we place, embedded in your team like any other dedicated expert and priced within the same monthly range.',
    guide: { href: '/blog/hire-dedicated-ai-engineer-india', label: 'How to hire a dedicated AI engineer from India' },
  },
  {
    question: 'How fast can the expert start?',
    answer: 'Your expert is live in about 7 days. After a 30-minute call we hand-pick and vet 2-3 experts, you interview and choose, and the one you pick joins your team\'s tools and standups.',
  },
  {
    question: 'What if the fit is wrong?',
    answer: 'Every dedicated expert comes with our 48-hour replacement guarantee. If the fit fails, a vetted replacement joins your team within 48 hours.',
  },
  {
    question: 'Is there a minimum term or lock-in?',
    answer: 'No. The engagement runs month to month, with no lock-in and no recruitment fee. Scale up, pause or stop when your business needs change.',
  },
]

// Google reads a few HTML tags inside an answer, <a> among them, so the guide travels with its answer.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer, guide }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: guide ? `${answer} <a href="${SITE_URL}${guide.href}">${guide.label}</a>` : answer,
    },
  })),
}

export default function DedicatedExpertsFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 px-4">
      <JsonLd data={faqJsonLd} />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-violet-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">FAQ</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
            Questions founders <span className="gradient-text-violet">ask us</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <h3 className="text-white font-semibold text-lg">{faq.question}</h3>
                  {isOpen
                    ? <Minus className="w-5 h-5 text-violet-400 flex-shrink-0" />
                    : <Plus className="w-5 h-5 text-violet-400 flex-shrink-0" />}
                </button>
                <motion.div
                  id={`faq-answer-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                    <p>{faq.answer}</p>
                    {faq.guide && (
                      <Link href={faq.guide.href} className="inline-flex items-center gap-1 mt-3 text-violet-400 hover:underline">
                        <span>{faq.guide.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
