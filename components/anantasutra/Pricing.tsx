'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  CheckCircle, 
  Star,
  ArrowRight,
  Package,
  Users,
  Building,
  FileText,
  Heart,
  ShoppingCart,
  Mail
} from 'lucide-react'
import Link from 'next/link'

const Pricing = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const saasProducts = [
    {
      name: 'Inventory Management',
      description: 'Streamline inventory operations with real-time tracking',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      pricing: {
        basic: '$50-100',
        professional: '$112-200',
        enterprise: '$200+'
      },
      period: '/user/month',
      features: [
        'Real-time Inventory Tracking',
        'Automated Reorder Points',
        'Multi-location Management',
        'Barcode Scanning Integration',
        'Advanced Analytics & Reporting'
      ],
      popular: false
    },
    {
      name: 'Bill Management ERP',
      description: 'Complete enterprise resource planning solution',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      pricing: {
        basic: '$45',
        professional: '$55-89',
        enterprise: '$89+'
      },
      period: '/user/month',
      features: [
        'Automated Invoice Generation',
        'Multi-currency Support',
        'Payment Gateway Integration',
        'Financial Reporting & Analytics',
        'Tax Management'
      ],
      popular: true
    },
    {
      name: 'School Management',
      description: 'Comprehensive school administration system',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      pricing: {
        basic: '$1,000-5,000',
        professional: '$5,000-20,000',
        enterprise: '$20,000+'
      },
      period: '/year',
      features: [
        'Student Information Management',
        'Grade & Attendance Tracking',
        'Teacher Portal & Resources',
        'Parent Communication System',
        'Fee Management & Payments'
      ],
      popular: false
    },
    {
      name: 'CRM System',
      description: 'Customer relationship management platform',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      pricing: {
        basic: '$10-30',
        professional: '$60-150',
        enterprise: '$150+'
      },
      period: '/user/month',
      features: [
        'Lead Management & Tracking',
        'Sales Pipeline Management',
        'Customer Communication History',
        'Task & Activity Management',
        'Email Marketing Integration'
      ],
      popular: false
    },
    {
      name: 'EHR Management',
      description: 'Electronic health records with HIPAA compliance',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      pricing: {
        basic: '$140-250',
        professional: '$350-500',
        enterprise: '$500+'
      },
      period: '/user/month',
      features: [
        'Patient Records Management',
        'Appointment Scheduling',
        'Prescription Management',
        'Medical History Tracking',
        'HIPAA Compliance'
      ],
      popular: false
    },
    {
      name: 'E-commerce Generation',
      description: 'Complete e-commerce platform with customizable themes',
      icon: ShoppingCart,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      pricing: {
        basic: '$16-49',
        professional: '$79-150',
        enterprise: '$299-499'
      },
      period: '/month + fees',
      features: [
        'Customizable Store Themes',
        'Product Catalog Management',
        'Shopping Cart & Checkout',
        'Payment Gateway Integration',
        'Order Management System'
      ],
      popular: false
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
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        ><h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        What We <span className="text-emerald-600">Do?</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        We provide comprehensive technology solutions through SaaS products, in-house engineering teams, 
        and comprehensive technology services to accelerate your business growth.
      </p>
          
        </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            SaaS <span className="text-emerald-600">Subscription Plans</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our comprehensive suite of SaaS products with flexible pricing tiers 
            designed to scale with your business needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {saasProducts.map((product, index) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${product.bgColor} ${product.borderColor} border rounded-2xl p-8 relative hover:shadow-xl transition-all duration-300 group hover:scale-105 ${
                  product.popular ? 'ring-2 ring-emerald-500 ring-opacity-50' : ''
                }`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {product.description}
                  </p>
                  
                  {/* Pricing Tiers */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg border border-white/20">
                      <span className="text-xs font-medium text-gray-600">Basic</span>
                      <span className="text-sm font-bold text-emerald-600">{product.pricing.basic}{product.period}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg border border-white/20">
                      <span className="text-xs font-medium text-gray-600">Professional</span>
                      <span className="text-sm font-bold text-emerald-600">{product.pricing.professional}{product.period}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg border border-white/20">
                      <span className="text-xs font-medium text-gray-600">Enterprise</span>
                      <span className="text-sm font-bold text-emerald-600">{product.pricing.enterprise}{product.period}</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + featureIndex * 0.05 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <a
                  href="mailto:sales@anantasutra.com?subject=Demo Request"
                  className={`w-full bg-gradient-to-r ${product.color} text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:scale-105`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Book Demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Custom Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Every business is unique. Contact us for a personalized quote 
              tailored to your specific requirements and budget.
            </p>
            <a
              href="mailto:sales@anantasutra.com?subject=Custom Solution Inquiry"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto w-fit"
            >
              <Mail className="w-5 h-5" />
              <span>Get Custom Quote</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
