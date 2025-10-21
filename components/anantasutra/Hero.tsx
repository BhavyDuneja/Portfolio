'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Code, Cloud, Database, Shield, Zap, Users } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  const features = [
    { icon: Code, text: 'Full-Stack Development' },
    { icon: Cloud, text: 'Cloud Architecture' },
    { icon: Database, text: 'Database Design' },
    { icon: Shield, text: 'Security Solutions' },
    { icon: Zap, text: 'Performance Optimization' },
    { icon: Users, text: 'Team Leadership' },
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
                Anantasutra
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                The endless thread of knowledge and innovation.
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Empowering businesses with cutting-edge technology solutions. 
              From full-stack development to cloud architecture, we deliver 
              excellence in every project.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              )
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/services"
              className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/co-founder"
              className="group bg-white text-emerald-600 border-2 border-emerald-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <span>Meet Our Co-founder</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: '15+', label: 'Projects Delivered' },
              { number: '100%', label: 'Client Satisfaction' },
              { number: '4+', label: 'Years Experience' },
              { number: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
