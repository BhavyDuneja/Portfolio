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
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

const ServicesList = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const services = [
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'Complete web and mobile application development using modern technologies and best practices.',
      features: [
        'React, Next.js, Node.js Development',
        'RESTful API Design & Implementation',
        'Database Design & Integration',
        'Responsive UI/UX Implementation',
        'Performance Optimization',
        'Code Review & Quality Assurance'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'MongoDB'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Cloud,
      title: 'Cloud Architecture',
      description: 'Scalable cloud solutions using AWS, Azure, and Google Cloud Platform for modern applications.',
      features: [
        'AWS/Azure/GCP Migration',
        'Microservices Architecture',
        'Container Orchestration (Docker, Kubernetes)',
        'Auto-scaling Solutions',
        'Cost Optimization',
        'Disaster Recovery Planning'
      ],
      technologies: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Robust database design and optimization for high-performance, scalable applications.',
      features: [
        'SQL & NoSQL Database Design',
        'Data Modeling & Architecture',
        'Performance Tuning & Optimization',
        'Backup & Recovery Strategies',
        'Data Migration Services',
        'Real-time Data Processing'
      ],
      technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Elasticsearch', 'Cassandra'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: Shield,
      title: 'Security Solutions',
      description: 'Comprehensive security implementation to protect your applications and sensitive data.',
      features: [
        'Security Audits & Assessments',
        'Authentication & Authorization',
        'Data Encryption & Protection',
        'Compliance Standards (GDPR, HIPAA)',
        'Threat Monitoring & Detection',
        'Penetration Testing'
      ],
      technologies: ['OAuth', 'JWT', 'SSL/TLS', 'Firewall', 'WAF', 'SIEM'],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      features: [
        'React Native Development',
        'iOS & Android Native Apps',
        'App Store Optimization',
        'Push Notifications',
        'Offline Capabilities',
        'Performance Optimization'
      ],
      technologies: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Xcode', 'Android Studio'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Speed and efficiency improvements for existing applications and systems.',
      features: [
        'Code Optimization & Refactoring',
        'Database Query Optimization',
        'Caching Strategies Implementation',
        'Load Balancing & Scaling',
        'Monitoring & Analytics Setup',
        'CDN Configuration'
      ],
      technologies: ['Redis', 'Nginx', 'CDN', 'Monitoring Tools', 'APM', 'Load Testing'],
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
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
            Comprehensive <span className="text-emerald-600">Technology Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We offer end-to-end technology solutions designed to accelerate your business growth 
            and digital transformation journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-white/80 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

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
      </div>
    </section>
  )
}

export default ServicesList
