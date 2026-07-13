'use client'

import { useEffect } from 'react'
import Hero from '@/components/anantasutra/Hero'
import Services from '@/components/anantasutra/Services'
import About from '@/components/anantasutra/About'
import WhyChooseUs from '@/components/anantasutra/WhyChooseUs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import JsonLd from '@/components/JsonLd'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AnantaSutra',
  url: 'https://anantasutra.com',
  description: 'Dedicated domain experts embedded in your team — you pay just the salary, no agency markup. Delhi-based, serving India, UAE, UK and beyond.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://anantasutra.com/blog?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function AnantasutraHome() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
      })
    }
  }, [])

  return (
    <div className="min-h-screen">
      <JsonLd data={websiteJsonLd} />
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-4">
              Ready to Begin?
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              Let&apos;s Weave Your Thread
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-lg mx-auto">
              Whether you need one embedded expert or a full growth pod — tell us the role, and we&apos;ll present 2–3 vetted profiles within 7 days.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/services" className="btn-outline">
                <span>Explore Services</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
