'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Code, 
  Users, 
  Award, 
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react'
import Link from 'next/link'

const Stats = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    {
      icon: Code,
      number: '15+',
      label: 'Projects Delivered',
      description: 'Successfully completed projects across various industries'
    },
    {
      icon: Users,
      number: '25+',
      label: 'Happy Clients',
      description: 'Satisfied clients who trust us with their technology needs'
    },
    {
      icon: Award,
      number: '100%',
      label: 'Success Rate',
      description: 'Every project delivered on time and within budget'
    },
    {
      icon: TrendingUp,
      number: '5+',
      label: 'Years Experience',
      description: 'Years of expertise in software development and architecture'
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'Support Available',
      description: 'Round-the-clock support for all our clients'
    },
    {
      icon: Shield,
      number: '0',
      label: 'Security Breaches',
      description: 'Zero security incidents across all our projects'
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-emerald-500 to-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-emerald-200">Achievements</span>
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Numbers that speak for our commitment to excellence and 
            client satisfaction in every project we undertake.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">
                  {stat.label}
                </h3>
                
                <p className="text-emerald-100 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-emerald-100 text-lg mb-6">
              Let's discuss how we can help you achieve your technology goals 
              and become part of our growing list of successful projects.
            </p>
            <Link
              href="/contact"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
            >
              Start Your Project Today
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Stats
