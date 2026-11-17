'use client'

import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import JsonLd from '@/components/JsonLd'
import { SITE_URL } from '@/lib/seo'

export interface Faq {
  question: string
  answer: string
  /** The guide that goes deeper: shown under the answer, and part of the answer in the FAQPage schema. */
  guide?: { href: string; label: string }
}

// Tailwind finds class names by reading the source, so each accent spells its classes out in full.
const ACCENTS = {
  violet: { eyebrow: 'text-violet-500', icon: 'text-violet-400', link: 'text-violet-400' },
  saffron: { eyebrow: 'text-saffron-500', icon: 'text-saffron-400', link: 'text-saffron-400' },
} as const

interface ServiceFaqProps {
  faqs: Faq[]
  /** The section's H2. */
  heading: ReactNode
  accent: keyof typeof ACCENTS
}

// Google reads a few HTML tags inside an answer, <a> among them, so the guide travels with its answer.
const faqJsonLd = (faqs: Faq[]) => ({
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
})

/** A service page's FAQ: an accordion, with the same questions and answers as FAQPage schema. */
export default function ServiceFaq({ faqs, heading, accent }: ServiceFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const colors = ACCENTS[accent]

  return (
    <section id="faq" className="py-20 px-4">
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className={`${colors.eyebrow} uppercase tracking-[0.2em] text-sm font-medium mb-3`}>FAQ</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">{heading}</h2>
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
                    ? <Minus className={`w-5 h-5 ${colors.icon} flex-shrink-0`} />
                    : <Plus className={`w-5 h-5 ${colors.icon} flex-shrink-0`} />}
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
                      <Link href={faq.guide.href} className={`inline-flex items-center gap-1 mt-3 ${colors.link} hover:underline`}>
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
