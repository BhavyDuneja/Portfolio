'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Code, 
  Cloud, 
  Database, 
  Shield, 
  Smartphone, 
  Zap, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const services = [
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'End-to-end web and mobile application development using modern technologies and best practices.',
      features: [
        'React, Next.js, Node.js',
        'RESTful API Development',
        'Database Design & Integration',
        'Responsive UI/UX Design',
        'Performance Optimization'
      ],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Cloud,
      title: 'Cloud Architecture',
      description: 'Scalable cloud solutions using AWS, Azure, and Google Cloud Platform.',
      features: [
        'AWS/Azure/GCP Migration',
        'Microservices Architecture',
        'Container Orchestration',
        'Auto-scaling Solutions',
        'Cost Optimization'
      ],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Robust database design and optimization for high-performance applications.',
      features: [
        'SQL & NoSQL Databases',
        'Data Modeling & Design',
        'Performance Tuning',
        'Backup & Recovery',
        'Data Migration'
      ],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: Shield,
      title: 'Security Solutions',
      description: 'Comprehensive security implementation to protect your applications and data.',
      features: [
        'Security Audits',
        'Authentication Systems',
        'Data Encryption',
        'Compliance Standards',
        'Threat Monitoring'
      ],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      features: [
        'React Native Development',
        'iOS & Android Apps',
        'App Store Optimization',
        'Push Notifications',
        'Offline Capabilities'
      ],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Speed and efficiency improvements for existing applications and systems.',
      features: [
        'Code Optimization',
        'Database Tuning',
        'Caching Strategies',
        'Load Balancing',
        'Monitoring & Analytics'
      ],
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
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
            Our <span className="text-emerald-600">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive technology solutions to help your business 
            thrive in the digital landscape. From development to deployment, 
            we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${service.bgColor} ${service.borderColor} border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + featureIndex * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`w-full bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105`}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss your project and create a solution that drives your business forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get Free Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/testimonials"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 hover:scale-105"
              >
                View Our Portfolio
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
