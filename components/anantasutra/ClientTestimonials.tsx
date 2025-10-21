'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote, Building, Globe } from 'lucide-react'

const ClientTestimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    {
      name: 'Jatin Sambharwal',
      role: 'Senior Manager',
      company: 'Oak Solutions',
      location: 'India',
      image: 'JS',
      rating: 5,
      content: 'Bhavya is an exceptional software engineer with outstanding technical skills and a strong work ethic. His ability to quickly adapt to new technologies and deliver high-quality solutions has been remarkable. He consistently goes above and beyond to ensure project success.',
      project: 'System Architecture',
      duration: 'Ongoing',
      impact: 'Exceptional performance'
    },
    {
      name: 'Dhirah',
      role: 'Frontend Developer',
      company: 'SAVE',
      location: 'India',
      image: 'D',
      rating: 5,
      content: 'Working with Bhavya has been a pleasure. His expertise in frontend technologies and his ability to create responsive, visually appealing interfaces is impressive. He brings innovative solutions to complex problems and always maintains the highest standards of code quality. A true professional.',
      project: 'Frontend Development',
      duration: 'Completed',
      impact: 'High-quality deliverables'
    },
    {
      name: 'Team Lead',
      role: 'Senior Developer',
      company: 'Mega Group',
      location: 'India',
      image: 'MG',
      rating: 5,
      content: 'Bhavya\'s expertise in Java, Go, and AWS technologies has been instrumental in our project success. His ability to work with complex systems and deliver scalable solutions is outstanding. He consistently demonstrates strong problem-solving skills and technical leadership.',
      project: 'Full-Stack Development',
      duration: 'Completed',
      impact: 'Project success'
    },
    {
      name: 'Team Lead',
      role: 'Senior Developer',
      company: 'Krayonnz',
      location: 'India',
      image: 'K',
      rating: 5,
      content: 'Bhavya\'s dedication to continuous learning and his ability to bridge cultural gaps in international teams is commendable. His technical skills combined with excellent communication make him an invaluable team member.',
      project: 'International Collaboration',
      duration: 'Completed',
      impact: 'Team success'
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
            What Our <span className="text-emerald-600">Clients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real feedback from real clients who have experienced the Anantasutra difference. 
            Their success is our success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-emerald-500 mb-6" />
              
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Project Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-gray-900">{testimonial.project}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Duration: {testimonial.duration}</div>
                  <div>Impact: {testimonial.impact}</div>
                </div>
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{testimonial.image}</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-emerald-600 font-medium">{testimonial.company}</div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Globe className="w-3 h-3" />
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-8">Client Satisfaction Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-emerald-100">Client Retention</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-emerald-100">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-emerald-100">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Successful Projects</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ClientTestimonials
