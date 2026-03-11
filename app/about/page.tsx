'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight, Sparkles, MapPin, Briefcase, Code,
  Heart, Globe, Linkedin, Github, Mail
} from 'lucide-react'

const timeline = [
  {
    period: 'The Vision',
    title: 'AnantaSutra is Born',
    description: 'Founded with the belief that wisdom is infinite and should touch every aspect of life — from technology to spirituality, from business to daily living.',
  },
  {
    period: 'AI & Automation',
    title: 'First Thread Woven',
    description: 'Launched AI automation services — voice calling agents, recruiter AI, and marketing tools — making powerful AI accessible at ₹6/min.',
  },
  {
    period: 'Creative Agency',
    title: 'Amplifying Brands',
    description: 'Expanded into full-service marketing — shooting, content creation, social media management, and performance marketing.',
  },
  {
    period: 'Wisdom Apps',
    title: 'Granthas & Ritualist',
    description: 'Began building apps that bridge ancient wisdom with modern tech — Granthas for Hindu scriptures and Ritualist for daily rituals.',
  },
  {
    period: 'The Future',
    title: 'Infinite Threads',
    description: 'Expanding into e-commerce, real estate, immigration support, business solutions, and academic solutions. The tapestry grows.',
  },
]

export default function AboutPage() {
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
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-4"
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            The Story of <br />
            <span className="gradient-text-divine">Infinite Wisdom</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            AnantaSutra — अनन्तसूत्र — is more than a company. It is an infinite thread weaving together
            technology, creativity, wisdom, and human potential into a tapestry of purposeful ventures.
          </motion.p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 md:p-14 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />
            <div className="absolute -top-20 -right-20 text-[200px] font-display text-saffron-500/[0.03] select-none pointer-events-none">
              ॐ
            </div>

            <Sparkles className="w-8 h-8 text-saffron-500 mb-6" />

            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8">
              Our Philosophy
            </h2>

            <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
              <p>
                <span className="text-white font-medium">AnantaSutra means &ldquo;Infinite Wisdom.&rdquo;</span>{' '}
                We believe that knowledge knows no boundaries — it flows from ancient scriptures to modern algorithms,
                from creative expression to business strategy. Each venture we build is a thread (sutra) in this infinite tapestry.
              </p>
              <p>
                We are not a single-domain company. We are a constellation of purpose-driven ventures, each addressing
                a different facet of human need — making AI accessible at revolutionary prices, preserving sacred wisdom
                through technology, amplifying brands through creative storytelling, and nurturing daily rituals for mindful living.
              </p>
              <p>
                <span className="text-saffron-400">The convergence of tradition and technology</span> is where
                we find our unique strength. Where others see separate worlds, we see connected threads waiting to be woven together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-violet-400 uppercase tracking-[0.2em] text-sm font-medium mb-3">Our Journey</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Threads <span className="gradient-text-violet">Woven</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-saffron-500/30 via-violet-500/30 to-transparent" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.period}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-start gap-8 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-dark-950 border-2 border-saffron-500/50 z-10" />

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="text-saffron-500 text-sm font-medium uppercase tracking-wider">
                      {item.period}
                    </span>
                    <h3 className="text-white text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Co-founder */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">Leadership</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Meet the <span className="gradient-text-saffron">Co-founder</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 md:p-12 grid md:grid-cols-3 gap-8 items-center"
          >
            {/* Photo placeholder */}
            <div className="md:col-span-1 flex justify-center">
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-saffron-500/20 to-violet-500/20 flex items-center justify-center border border-white/10 overflow-hidden">
                <div className="text-center">
                  <div className="text-5xl font-display font-bold gradient-text-saffron">BD</div>
                  <p className="text-gray-500 text-xs mt-1">Co-founder</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <h3 className="font-display text-2xl font-bold text-white mb-1">Bhavya Duneja</h3>
              <p className="text-saffron-400 font-medium mb-4">Co-founder, AnantaSutra</p>

              <p className="text-gray-400 leading-relaxed mb-6">
                A technologist and visionary bridging the worlds of AI, marketing, spirituality, and business.
                With experience spanning software engineering and entrepreneurship, Bhavya co-founded AnantaSutra
                to create an ecosystem where infinite wisdom meets modern innovation.
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-saffron-500" /> Delhi, India
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Briefcase className="w-3.5 h-3.5 text-saffron-500" /> Entrepreneur
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Code className="w-3.5 h-3.5 text-saffron-500" /> Technologist
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Heart className="w-3.5 h-3.5 text-saffron-500" /> Spiritualist
                </span>
              </div>

              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/bhavy-duneja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-saffron-500 hover:border-saffron-500/30 transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/bhavyaduneja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-saffron-500 hover:border-saffron-500/30 transition-all"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:co-founder@anantasutra.com"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-saffron-500 hover:border-saffron-500/30 transition-all"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/co-founder" className="btn-outline">
              <span>View Full Portfolio</span>
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />
            <Globe className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of the Tapestry
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Whether you&apos;re a client, partner, or fellow dreamer — there&apos;s a thread waiting for you.
            </p>
            <Link href="/contact" className="btn-primary">
              <span>Start a Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
