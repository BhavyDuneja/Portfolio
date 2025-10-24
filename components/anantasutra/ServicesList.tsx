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
  CheckCircle,
  Package,
  Users,
  Building,
  FileText,
  Heart,
  ShoppingCart,
  Mail,
  Star
} from 'lucide-react'
import Link from 'next/link'

const ServicesList = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // SaaS Products
  const saasProducts = [
    {
      icon: Package,
      title: 'Inventory Management Application',
      description: 'Streamline your inventory operations with real-time tracking, automated reordering, and comprehensive reporting.',
      features: [
        'Real-time Inventory Tracking',
        'Automated Reorder Points',
        'Multi-location Management',
        'Barcode Scanning Integration',
        'Advanced Analytics & Reporting',
        'Supplier Management'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Stripe'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      pricing: {
        basic: '$50-100/user/month',
        professional: '$112-200/user/month',
        enterprise: '$200+/user/month'
      }
    },
    {
      icon: FileText,
      title: 'Bill Management ERP',
      description: 'Complete enterprise resource planning solution for billing, invoicing, and financial management.',
      features: [
        'Automated Invoice Generation',
        'Multi-currency Support',
        'Payment Gateway Integration',
        'Financial Reporting & Analytics',
        'Tax Management',
        'Approval Workflows'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS', 'QuickBooks API'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      pricing: {
        basic: '$45/user/month',
        professional: '$55-89/user/month',
        enterprise: '$89+/user/month'
      }
    },
    {
      icon: Building,
      title: 'School Management Application',
      description: 'Comprehensive school administration system for students, teachers, and administrative staff.',
      features: [
        'Student Information Management',
        'Grade & Attendance Tracking',
        'Teacher Portal & Resources',
        'Parent Communication System',
        'Fee Management & Payments',
        'Academic Calendar & Scheduling'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Stripe', 'Email API'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      pricing: {
        basic: '$1,000-5,000/year',
        professional: '$5,000-20,000/year',
        enterprise: '$20,000+/year'
      }
    },
    {
      icon: Users,
      title: 'CRM System',
      description: 'Customer relationship management platform to boost sales and improve customer satisfaction.',
      features: [
        'Lead Management & Tracking',
        'Sales Pipeline Management',
        'Customer Communication History',
        'Task & Activity Management',
        'Email Marketing Integration',
        'Sales Analytics & Reporting'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'SendGrid', 'Calendar API'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      pricing: {
        basic: '$10-30/user/month',
        professional: '$60-150/user/month',
        enterprise: '$150+/user/month'
      }
    },
    {
      icon: Heart,
      title: 'EHR Management System',
      description: 'Electronic health records management with HIPAA compliance and advanced patient care features.',
      features: [
        'Patient Records Management',
        'Appointment Scheduling',
        'Prescription Management',
        'Medical History Tracking',
        'HIPAA Compliance',
        'Telemedicine Integration'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'HIPAA', 'HL7 FHIR'],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      pricing: {
        basic: '$140-250/user/month',
        professional: '$350-500/user/month',
        enterprise: '$500+/user/month'
      }
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Generation',
      description: 'Complete e-commerce platform with customizable themes and integrated payment processing.',
      features: [
        'Customizable Store Themes',
        'Product Catalog Management',
        'Shopping Cart & Checkout',
        'Payment Gateway Integration',
        'Order Management System',
        'Inventory Synchronization'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS', 'CDN'],
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      pricing: {
        basic: '$16-49/month + fees',
        professional: '$79-150/month + fees',
        enterprise: '$299-499/month + fees'
      }
    }
  ]

  // In-House Engineers
  const inHouseServices = [
    {
      name: 'Starter',
      description: 'Perfect for small projects and MVPs',
      price: '$2,500',
      period: '/month',
      icon: Code,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: [
        'Up to 20 hours/month',
        'Basic web application',
        'Standard support',
        'Monthly progress reports',
        'Source code access',
        'Basic deployment'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      price: '$3,500',
      period: '/month',
      icon: Cloud,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      features: [
        'Up to 40 hours/month',
        'Full-stack applications',
        'Priority support',
        'Weekly progress reports',
        'Advanced deployment',
        'Performance optimization',
        'Security implementation',
        'Database design'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large-scale projects',
      price: '$5,500',
      period: '/month',
      icon: Database,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: [
        'Unlimited hours',
        'Complex enterprise solutions',
        '24/7 dedicated support',
        'Daily progress reports',
        'Cloud architecture',
        'Microservices implementation',
        'Advanced security',
        'Scalability planning',
        'Team augmentation'
      ],
      popular: false
    }
  ]

  // Comprehensive Technology Services
  const comprehensiveServices = [
    {
      icon: Code,
      title: 'Dedicated Development Teams',
      description: 'Full-time dedicated engineering teams working exclusively on your projects with flexible engagement models.',
      features: [
        'Full-time Dedicated Developers',
        'Flexible Team Sizing (1-10+ developers)',
        'Direct Communication & Collaboration',
        'Agile Development Methodology',
        'Code Ownership & IP Rights',
        'Long-term Partnership Models'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'Python', 'Java', 'AWS'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: Users,
      title: 'Team Augmentation',
      description: 'Scale your existing team with skilled engineers who integrate seamlessly with your workflow.',
      features: [
        'Senior & Mid-level Engineers',
        'Technology Stack Expertise',
        'Remote & On-site Options',
        'Quick Onboarding Process',
        'Cultural Fit Assessment',
        'Performance Monitoring'
      ],
      technologies: ['React', 'Vue.js', 'Angular', 'Python', 'Java', 'DevOps'],
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      icon: Zap,
      title: 'Technical Consulting',
      description: 'Expert technical guidance and architecture decisions for complex projects and technology choices.',
      features: [
        'Technology Stack Selection',
        'System Architecture Design',
        'Code Review & Best Practices',
        'Performance Optimization',
        'Security Audits',
        'Technical Documentation'
      ],
      technologies: ['Architecture', 'Microservices', 'Cloud', 'Security', 'DevOps', 'AI/ML'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
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
    }
  ]

  const renderServiceCard = (service: any, index: number, showPricing = false) => {
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

        {showPricing && service.pricing && (
          <div className="mb-6 p-4 bg-white/50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing Tiers:</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Basic</span>
                <span className="text-sm font-bold text-emerald-600">{service.pricing.basic}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Professional</span>
                <span className="text-sm font-bold text-emerald-600">{service.pricing.professional}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Enterprise</span>
                <span className="text-sm font-bold text-emerald-600">{service.pricing.enterprise}</span>
              </div>
            </div>
          </div>
        )}

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
            {service.features.map((feature: string, featureIndex: number) => (
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
            {service.technologies.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="bg-white/80 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

        <a
          href="mailto:sales@anantasutra.com?subject=Demo Request"
                  className={`w-full bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105`}
                >
          <Mail className="w-4 h-4" />
          <span>Book Demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
              </motion.div>
            )
  }

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

      
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              <span className="text-emerald-600">In-House Engineers</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dedicated development teams for custom project requirements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {inHouseServices.map((plan, index) => {
              const Icon = plan.icon
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`${plan.bgColor} ${plan.borderColor} border rounded-2xl p-8 relative hover:shadow-xl transition-all duration-300 group hover:scale-105 ${
                    plan.popular ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + featureIndex * 0.05 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <a
                    href="mailto:sales@anantasutra.com?subject=Demo Request"
                    className={`w-full bg-gradient-to-r ${plan.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Book Demo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Comprehensive Technology Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              <span className="text-emerald-600">Comprehensive Technology Services</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end technology solutions for complex business requirements
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {comprehensiveServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className={`${service.bgColor} ${service.borderColor} border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105`}
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
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
                    {service.features.map((feature: string, featureIndex: number) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 + featureIndex * 0.05 }}
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
                    {service.technologies.map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="bg-white/80 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href="mailto:sales@anantasutra.com?subject=Demo Request"
                  className={`w-full bg-gradient-to-r ${service.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Book Demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Demo CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Book a personalized demo to see how our solutions can accelerate your digital transformation journey.
            </p>
            <a
              href="mailto:sales@anantasutra.com?subject=Demo Request"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto w-fit"
            >
              <Mail className="w-5 h-5" />
              <span>Book Demo at sales@anantasutra.com</span>
              <ArrowRight className="w-5 h-5" />
            </a>
        </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesList
