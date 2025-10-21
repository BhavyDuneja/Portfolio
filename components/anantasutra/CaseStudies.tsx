'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

const CaseStudies = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const caseStudies = [
    {
      title: 'TechCorp Legacy System Modernization',
      client: 'TechCorp',
      industry: 'Technology',
      duration: '6 months',
      team: '8 developers',
      challenge: 'Modernize a 10-year-old legacy system with 50+ integrations',
      solution: 'Implemented microservices architecture with modern tech stack',
      results: [
        '40% performance improvement',
        '99.9% uptime achieved',
        '50% reduction in maintenance costs',
        'Zero downtime migration'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'MVP Development',
      client: 'Startup',
      industry: 'Fintech',
      duration: '3 months',
      team: '5 developers',
      challenge: 'Build a scalable fintech platform from scratch',
      solution: 'Developed secure, compliant platform with real-time processing',
      results: [
        'Launched 2 months ahead of schedule',
        '300% increase in user engagement',
        'SOC 2 compliance achieved',
        '$2M in funding secured'
      ],
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'AWS', 'Redis'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'DataFlow Cloud Migration',
      client: 'Dhirah',
      industry: 'Data Analytics',
      duration: '4 months',
      team: '6 developers',
      challenge: 'Migrate on-premise data processing to cloud',
      solution: 'Designed scalable cloud architecture with auto-scaling',
      results: [
        '10x scalability improvement',
        '60% cost reduction',
        'Real-time data processing',
        'Global deployment achieved'
      ],
      technologies: ['Python', 'Apache Kafka', 'AWS', 'Terraform', 'Docker', 'Grafana'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
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
            Success <span className="text-emerald-600">Case Studies</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real projects, real results. See how we've helped businesses transform 
            their technology and achieve their goals.
          </p>
        </motion.div>

        <div className="space-y-16">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`${study.bgColor} ${study.borderColor} border rounded-3xl p-8 md:p-12`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${study.color} rounded-2xl flex items-center justify-center`}>
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{study.title}</h3>
                      <p className="text-gray-600">{study.client} • {study.industry}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-gray-600">Duration: {study.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-gray-600">Team: {study.team}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Challenge:</h4>
                    <p className="text-gray-700">{study.challenge}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Solution:</h4>
                    <p className="text-gray-700">{study.solution}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-white/80 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className={`bg-gradient-to-r ${study.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2`}>
                    <span>View Full Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Column - Results */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Key Results:</h4>
                  <div className="space-y-4">
                    {study.results.map((result, resultIndex) => (
                      <motion.div
                        key={resultIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.2 + resultIndex * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{result}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Impact Metrics */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/80 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">40%</div>
                      <div className="text-sm text-gray-600">Performance Boost</div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Create Your Success Story?</h3>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and see how we can help you achieve similar results.
            </p>
            <Link
              href="/contact"
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CaseStudies
