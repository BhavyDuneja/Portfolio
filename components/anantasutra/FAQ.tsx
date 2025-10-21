'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import Link from 'next/link'

const FAQ = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What services does Anantasutra offer?',
      answer: 'We offer comprehensive technology solutions including full-stack development, cloud architecture, mobile app development, database solutions, security implementation, and performance optimization. Our services cover the entire technology lifecycle from planning to deployment and maintenance.'
    },
    {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on complexity and scope. Simple web applications typically take 2-4 months, while complex enterprise solutions can take 6-12 months. We provide detailed timelines during our initial consultation and maintain agile development practices to ensure timely delivery.'
    },
    {
      question: 'What is your development process?',
      answer: 'We follow an agile development methodology with four main phases: Discovery & Consultation, Planning & Design, Development & Testing, and Deployment & Support. Each phase includes regular client communication, progress updates, and quality assurance to ensure project success.'
    },
    {
      question: 'Do you provide ongoing support and maintenance?',
      answer: 'Yes, we offer comprehensive support and maintenance services including 24/7 technical support, regular updates, security patches, performance monitoring, and feature enhancements. Our support packages are tailored to your specific needs and budget.'
    },
    {
      question: 'What technologies do you work with?',
      answer: 'We work with modern, industry-standard technologies including React, Next.js, Node.js, TypeScript, Python, AWS, Azure, PostgreSQL, MongoDB, Docker, Kubernetes, and many more. We choose the best technology stack for each project based on requirements and scalability needs.'
    },
    {
      question: 'How do you ensure project security?',
      answer: 'Security is our top priority. We implement industry best practices including secure coding standards, regular security audits, data encryption, secure authentication, compliance with standards like GDPR and HIPAA, and continuous security monitoring throughout the development process.'
    },
    {
      question: 'What is your pricing model?',
      answer: 'We offer flexible pricing models including fixed-price projects, time and materials, and retainer agreements. Our pricing is transparent and based on project scope, complexity, and timeline. We provide detailed quotes after understanding your requirements.'
    },
    {
      question: 'Do you work with startups and small businesses?',
      answer: 'Absolutely! We work with businesses of all sizes, from startups to large enterprises. We offer scalable solutions and flexible engagement models to fit different budgets and requirements. Our team understands the unique challenges faced by growing businesses.'
    },
    {
      question: 'How do you handle project communication?',
      answer: 'We maintain transparent communication throughout the project lifecycle. This includes regular progress updates, milestone reviews, dedicated project managers, and direct access to our development team. We use modern collaboration tools and provide detailed documentation.'
    },
    {
      question: 'What makes Anantasutra different?',
      answer: 'Our combination of technical expertise, business acumen, and client-focused approach sets us apart. We have a 100% client retention rate, 5+ years of experience, and a track record of delivering projects on time and within budget. Our CTO brings deep technical knowledge and leadership experience.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Find answers to common questions about our services, process, and approach.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Plus className="w-6 h-6 text-emerald-500" />
                  )}
                </div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Contact us directly and we'll be happy to help.
            </p>
            <Link
              href="/contact"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105"
            >
              Contact Us Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
