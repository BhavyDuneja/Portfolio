'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Code, Cloud, Database, Shield, Users, Target, Award, TrendingUp } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const values = [
    {
      icon: Code,
      title: 'Technical Excellence',
      description: 'We maintain the highest standards in code quality, architecture, and implementation.',
    },
    {
      icon: Users,
      title: 'Client-Centric Approach',
      description: 'Every solution is tailored to meet your specific business needs and objectives.',
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Security is integrated into every aspect of our development process.',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Solutions',
      description: 'We build systems that grow with your business and adapt to changing requirements.',
    },
  ]

  const achievements = [
    { number: '4+', label: 'Years of Excellence' },
    { number: '15+', label: 'Successful Projects' },
    { number: '100%', label: 'Client Retention' },
    { number: '24/7', label: 'Support Available' },
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
            About <span className="text-emerald-600">Anantasutra</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a technology solutions company dedicated to delivering 
            exceptional software development services. Our team combines 
            deep technical expertise with business acumen to create 
            solutions that drive real business value.
          </p>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-3xl p-8 md:p-12 mb-16"
        >
          <div className="text-center">
            <Target className="w-12 h-12 text-emerald-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              To empower businesses with innovative technology solutions that drive growth, 
              efficiency, and competitive advantage. We believe in building long-term 
              partnerships and delivering value that extends far beyond project completion.
            </p>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                {achievement.number}
              </div>
              <div className="text-gray-600 font-medium">
                {achievement.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
