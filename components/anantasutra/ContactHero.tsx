'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Mail, MapPin, Clock, ArrowRight } from 'lucide-react'

const ContactHero = () => {
  const contactMethods = [
    { icon: Mail, title: 'Email Us', description: 'contact@anantasutra.com', action: 'Send Email' },
    { icon: MessageCircle, title: 'Live Chat', description: 'Available 24/7', action: 'Start Chat' },
    { icon: MapPin, title: 'Visit Us', description: 'Delhi, India', action: 'Get Directions' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-emerald-100/20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Let's Start Your Project
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your business with cutting-edge technology? 
              Contact us for a free consultation and let's discuss your project.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {method.description}
                  </p>
                  <button className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
                    <span>{method.action}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl p-8 max-w-4xl mx-auto shadow-lg"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Clock className="w-8 h-8 text-emerald-500" />
              <h3 className="text-2xl font-bold text-gray-900">Quick Response Guarantee</h3>
            </div>
            <p className="text-gray-600 text-lg">
              We respond to all inquiries within 24 hours. For urgent projects, 
              we offer same-day consultation calls to get you started immediately.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactHero
