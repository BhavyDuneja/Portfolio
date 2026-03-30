'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Mail, MapPin, Send, CheckCircle, AlertCircle,
  ArrowRight, MessageSquare, Clock, Sparkles
} from 'lucide-react'
import { event as gtagEvent } from '@/lib/gtag'

const services = [
  'AI Voice Agents',
  'AI Video Generators',
  'Social Media Automation',
  'Gmail Automation',
  'AI Marketing Tools',
  'Recruiter AI',
  'Marketing Agency',
  'Content & Shooting',
  'Other',
]

const faqs = [
  {
    q: 'How much do voice calling agents cost?',
    a: 'Our AI voice calling agents start at just ₹6 per minute. The exact pricing depends on your volume, complexity, and integration requirements.',
  },
  {
    q: 'What is Recruiter AI?',
    a: 'Our Recruiter AI helps you find job opportunities or candidates at ₹2 per lead. It uses AI to generate boolean searches, find contacts, and draft personalized outreach.',
  },
  {
    q: 'Do you handle everything for marketing?',
    a: 'Yes! Our marketing agency provides end-to-end support — from professional shooting and content creation to social media management and performance marketing.',
  },
  {
    q: 'Are Ritualist and Granthas free?',
    a: 'Ritualist is completely free. Granthas will have a free tier with core scriptures, and a premium tier for advanced features and commentaries.',
  },
  {
    q: 'Can I get a custom AI solution?',
    a: 'Absolutely. We build custom AI automation solutions tailored to your business needs. Contact us to discuss your requirements.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', service: '', message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const formRef = useRef(null)
  const isFormInView = useInView(formRef, { once: true })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', service: '', message: '' })
        gtagEvent('contact_form_submit', {
          service: formData.service,
        })
      } else {
        setSubmitStatus('error')
        gtagEvent('contact_form_error', {
          error_type: 'server_error',
          status: response.status,
        })
      }
    } catch {
      setSubmitStatus('error')
      gtagEvent('contact_form_error', {
        error_type: 'network_error',
      })
    }
    setIsSubmitting(false)
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-4"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Let&apos;s <span className="gradient-text-saffron">Connect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Whether you need AI automation, marketing support, or want to explore a custom solution — we&apos;re here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: -40 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">Send us a message</h2>

              {submitStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-300">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Service Interested In</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all appearance-none"
                    >
                      <option value="" className="bg-dark-400">Select a service</option>
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-dark-400">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all resize-none"
                      placeholder="Tell us about your project or requirements..."
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isFormInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Contact Info</h3>
              <div className="space-y-4">
                <a href="mailto:contact@anantasutra.com" className="flex items-center gap-3 text-gray-400 hover:text-saffron-500 transition-colors">
                  <Mail className="w-5 h-5 text-saffron-500" />
                  <span className="text-sm">contact@anantasutra.com</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-saffron-500" />
                  <span className="text-sm">Delhi, India</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-3">Quick Response</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">We respond within 24 hours</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">Free consultation available</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">Custom solutions for every need</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 glow-saffron">
              <h3 className="font-semibold text-white mb-2">For Co-founder Inquiries</h3>
              <p className="text-gray-300 text-sm mb-3">
                Direct contact for partnerships and strategic discussions.
              </p>
              <a href="mailto:co-founder@anantasutra.com" className="text-saffron-400 text-sm font-medium hover:text-saffron-300 transition-colors">
                co-founder@anantasutra.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 mb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">FAQ</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Common <span className="gradient-text-saffron">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <ArrowRight className={`w-4 h-4 text-saffron-500 flex-shrink-0 transition-transform duration-300 ${
                    openFaq === i ? 'rotate-90' : ''
                  }`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
