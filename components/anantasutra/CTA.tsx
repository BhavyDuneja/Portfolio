'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const CTA = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'contact@anantasutra.com',
      action: 'Send Email',
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=contact@anantasutra.com&su=Anantasutra Consultation&body=Hi Anantasutra Team,%0D%0A%0D%0AI came across Anantasutra and would like to discuss potential technology solutions for my business.%0D%0A%0D%0ABest regards,'
    },
    {
      icon: MessageCircle,
      title: 'LinkedIn',
      description: 'Connect with our Co-Founder',
      action: 'Get in Touch',
      href: 'https://www.linkedin.com/in/bhavy-duneja'
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your <span className="text-emerald-400">Business</span>?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Let's discuss your project and create a technology solution that 
            drives your business forward. Get started with a free consultation.
          </p>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {method.title}
                </h3>
                
                <p className="text-gray-300 mb-6">
                  {method.description}
                </p>
                
                <a
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : '_self'}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : ''}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all duration-300 hover:scale-105 inline-block"
                >
                  {method.action}
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            Get Your Free Project Consultation
          </h3>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Schedule a 30-minute consultation to discuss your project requirements, 
            timeline, and budget. No obligations, just expert advice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/co-founder"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <span>Meet Our Co-founder</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Trusted by companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white font-semibold text-lg">SaveValues</div>
            <div className="text-white font-semibold text-lg">Dhirah</div>
            <div className="text-white font-semibold text-lg">Fit-First</div>
            
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
