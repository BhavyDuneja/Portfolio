'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Globe,
  Users,
  Award
} from 'lucide-react'

const ContactInfo = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const contactDetails = [
    {
      icon: Mail,
      title: 'Business Emails',
      details: [
        'contact@anantasutra.com - General inquiries',
        'support@anantasutra.com - Technical support',
        'co-founder@anantasutra.com - Executive contact'
      ],
      description: 'Choose the right email for your needs'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['Delhi, India', 'Global Remote Services'],
      description: 'Based in India, serving worldwide'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9 AM - 6 PM IST', '24/7 Emergency Support'],
      description: 'We respond within 24 hours'
    }
  ]

  const teamInfo = [
    {
      icon: Users,
      title: 'Team Size',
      value: '8+',
      description: 'Experienced developers and architects'
    },
    {
      icon: Award,
      title: 'Experience',
      value: '5+',
      description: 'Years of industry expertise'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      value: '15+',
      description: 'Countries served worldwide'
    },
    {
      icon: MessageCircle,
      title: 'Response Time',
      value: '< 24h',
      description: 'Average response time'
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in <span className="text-emerald-600">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Multiple ways to reach us. Choose the method that works best for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
            {contactDetails.map((contact, index) => {
              const Icon = contact.icon
              return (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {contact.title}
                    </h4>
                    <div className="space-y-1 mb-2">
                      {contact.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-700 font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {contact.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Team Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h3>
            <div className="grid grid-cols-2 gap-6">
              {teamInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600 mb-2">
                      {info.value}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {info.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white"
            >
              <h4 className="text-xl font-bold mb-4">Free Consultation</h4>
              <p className="text-emerald-100 mb-6">
                Schedule a free 30-minute consultation to discuss your project 
                requirements, timeline, and budget. No obligations, just expert advice.
              </p>
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                Schedule Consultation
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactInfo
