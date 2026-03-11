'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote, Star, User, Building, Award } from 'lucide-react'

const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    {
      name: 'Jatin Sambharwal',
      position: 'Senior Manager',
      company: 'Oak Solutions',
      content: 'Bhavya is an exceptional software engineer with outstanding technical skills and a strong work ethic. His ability to quickly adapt to new technologies and deliver high-quality solutions has been remarkable. He consistently goes above and beyond to ensure project success.',
      rating: 5,
      avatar: 'JS',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Dhirah',
      position: 'Frontend Developer',
      company: 'SAVE',
      content: 'Working with Bhavya has been a pleasure. His expertise in frontend technologies and his ability to create responsive, visually appealing interfaces is impressive. He brings innovative solutions to complex problems and always maintains the highest standards of code quality. A true professional.',
      rating: 5,
      avatar: 'D',
      color: 'from-saffron-500 to-orange-600'
    },
    {
      name: 'Team Lead',
      position: 'Senior Developer',
      company: 'Mega Group',
      content: 'Bhavya\'s expertise in Java, Go, and AWS technologies has been instrumental in our project success. His ability to work with complex systems and deliver scalable solutions is outstanding. He consistently demonstrates strong problem-solving skills and technical leadership.',
      rating: 5,
      avatar: 'MG',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Team Lead',
      position: 'Senior Developer',
      company: 'Krayonnz',
      content: 'Bhavya\'s dedication to continuous learning and his ability to bridge cultural gaps in international teams is commendable. His technical skills combined with excellent communication make him an invaluable team member.',
      rating: 5,
      avatar: 'K',
      color: 'from-violet-500 to-purple-600'
    }
  ]

  const achievements = [
    { number: '15+', label: 'Projects Delivered', icon: Award },
    { number: '4.8★', label: 'Average Rating', icon: Star },
    { number: '100%', label: 'Client Satisfaction', icon: User },
    { number: '3+', label: 'Years Experience', icon: Building }
  ]

  return (
    <section id="testimonials" ref={ref} className="section-spacing bg-dark-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6">
            <span className="gradient-text-saffron">Client Testimonials</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            What colleagues and clients say about working with me.
            These testimonials reflect my commitment to excellence and professional growth.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-saffron-500/10 rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-saffron-500" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-gray-400 text-center mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.position}</p>
                  <p className="text-sm text-saffron-500 font-medium">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-saffron-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <achievement.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-saffron-500 mb-2">{achievement.number}</div>
              <div className="text-gray-400 font-medium">{achievement.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="glass-card rounded-3xl p-12">
            <h3 className="text-3xl font-bold font-display mb-6 text-white">Professional Philosophy</h3>
            <blockquote className="text-xl text-gray-400 italic leading-relaxed max-w-4xl mx-auto mb-8">
              "Success in software engineering isn't just about writing code--it's about understanding
              business needs, collaborating effectively across cultures, and delivering solutions that
              make a real difference. Every project is an opportunity to learn, grow, and contribute
              to something meaningful."
            </blockquote>
            <div className="flex justify-center space-x-8">
              <div className="flex items-center space-x-2 text-saffron-500">
                <Star className="w-5 h-5" />
                <span className="font-medium">Excellence</span>
              </div>
              <div className="flex items-center space-x-2 text-violet-500">
                <User className="w-5 h-5" />
                <span className="font-medium">Collaboration</span>
              </div>
              <div className="flex items-center space-x-2 text-violet-400">
                <Award className="w-5 h-5" />
                <span className="font-medium">Innovation</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
