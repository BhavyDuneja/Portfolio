'use client'

import { motion } from 'framer-motion'
import { Star, Quote, Users, Award } from 'lucide-react'

const TestimonialsHero = () => {
  const stats = [
    { icon: Users, number: '25+', label: 'Happy Clients' },
    { icon: Star, number: '4.8', label: 'Average Rating' },
    { icon: Award, number: '100%', label: 'Success Rate' },
    { icon: Quote, number: '50+', label: 'Testimonials' },
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
                Projects & Testimonials
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Our Work & Success Stories
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our featured projects and hear from our satisfied clients about 
              their experience working with Anantasutra and the impact we've made.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Featured Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-xl"
          >
            <Quote className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed">
              "Anantasutra transformed our legacy system into a modern, scalable platform. 
              Their technical expertise and dedication to our success were unmatched. 
              The project was delivered on time and exceeded our expectations."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SJ</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg">Sahil Chauhan</div>
                <div className="text-gray-600">CEO, Fit-First</div>
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsHero
