'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  MessageCircle, 
  Search, 
  Code, 
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const Process = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const steps = [
    {
      icon: MessageCircle,
      title: 'Discovery & Consultation',
      description: 'We start by understanding your business goals, requirements, and challenges through detailed consultation.',
      details: [
        'Business requirements analysis',
        'Technical feasibility assessment',
        'Project scope definition',
        'Timeline and budget planning'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Search,
      title: 'Planning & Design',
      description: 'Our team creates a comprehensive project plan with detailed architecture and design specifications.',
      details: [
        'System architecture design',
        'UI/UX wireframing',
        'Technology stack selection',
        'Development roadmap creation'
      ],
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Code,
      title: 'Development & Testing',
      description: 'Agile development process with continuous testing and quality assurance throughout the project.',
      details: [
        'Agile development methodology',
        'Continuous integration/deployment',
        'Code review and quality assurance',
        'Regular progress updates'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Rocket,
      title: 'Deployment & Support',
      description: 'Smooth deployment with ongoing support and maintenance to ensure optimal performance.',
      details: [
        'Production deployment',
        'Performance monitoring',
        '24/7 technical support',
        'Regular maintenance and updates'
      ],
      color: 'from-orange-500 to-orange-600'
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
            Our <span className="text-emerald-600">Development Process</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We follow a proven methodology that ensures successful project delivery 
            with transparency, quality, and client satisfaction at every step.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                  {index + 1}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + detailIndex * 0.05 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Arrow to next step */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Process Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-6">Why Our Process Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-3">Transparent Communication</h4>
              <p className="text-emerald-100">
                Regular updates and clear communication throughout the entire project lifecycle.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">Quality Assurance</h4>
              <p className="text-emerald-100">
                Rigorous testing and code review processes ensure high-quality deliverables.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">Flexible Approach</h4>
              <p className="text-emerald-100">
                Agile methodology allows for changes and improvements during development.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Process
