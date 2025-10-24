'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Award, 
  Clock, 
  Users, 
  Shield, 
  Zap, 
  Target,
  CheckCircle,
  Star
} from 'lucide-react'

const WhyChooseUs = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const advantages = [
    {
      icon: Award,
      title: 'Proven Track Record',
      description: '5+ years of delivering successful projects with 100% client satisfaction.',
      stats: '100% Success Rate'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'We respect deadlines and deliver projects on time, every time.',
      stats: '95% On-Time Delivery'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced developers and architects with deep technical expertise.',
      stats: '5+ Years Experience'
    },
    {
      icon: Shield,
      title: 'Security Focus',
      description: 'Security-first approach with industry best practices and compliance.',
      stats: 'Zero Security Breaches'
    },
    {
      icon: Zap,
      title: 'Performance Optimized',
      description: 'Every solution is optimized for speed, scalability, and efficiency.',
      stats: '50% Performance Boost'
    },
    {
      icon: Target,
      title: 'Business Focused',
      description: 'We understand your business goals and align technology accordingly.',
      stats: 'ROI-Driven Solutions'
    }
  ]

  const testimonials = [
    {
      name: 'Sahil Chauhan',
      role: 'CEO, Fit-First',
      content: 'Anantasutra transformed our legacy system into a modern, scalable platform. Their expertise and dedication are unmatched.',
      rating: 5
    },
    {
      name: 'Romey Kumar',
      role: 'Founder, Dhirah',
      content: 'Working with Anantasutra was a game-changer. They delivered our MVP in record time with exceptional quality.',
      rating: 5
    },
    {
      name: 'Vansh Taneja',
      role: 'Product Manager, Save Values',
      content: 'Professional, reliable, and technically excellent. They exceeded our expectations in every way.',
      rating: 5
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-emerald-600">Anantasutra</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine technical excellence with business acumen to deliver 
            solutions that drive real results for your organization.
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon
            return (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {advantage.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {advantage.description}
                </p>

                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-600">
                    {advantage.stats}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h3>
            <p className="text-xl text-gray-600">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyChooseUs
