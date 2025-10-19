'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Award, Trophy, Star, Target, Users, Globe, Code, BookOpen, Calendar, MapPin } from 'lucide-react'

const Achievements = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const achievements = [
    {
      title: 'AWS Certified Solutions Architect – Associate',
      description: 'Demonstrated expertise in designing distributed systems on AWS platform',
      year: '2024',
      issuer: 'Amazon Web Services',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      category: 'Cloud Architecture'
    },
    {
      title: 'AWS Certified Cloud Practitioner',
      description: 'Foundation level certification in AWS cloud services and best practices',
      year: '2023',
      issuer: 'Amazon Web Services',
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      category: 'Cloud Fundamentals'
    },
    {
      title: 'Complete React Developer 2022',
      description: 'Comprehensive React development course with Redux, Hooks, and GraphQL',
      year: '2022',
      issuer: 'Udemy',
      icon: Code,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      category: 'Frontend Development'
    },
    {
      title: 'JLPT N3 Japanese Language',
      description: 'Japanese Language Proficiency Test N3 level certification',
      year: '2024',
      issuer: 'Japan Foundation',
      icon: Globe,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      category: 'Language Proficiency'
    }
  ]

  const milestones = [
    {
      title: 'Founded Fit-First Startup',
      description: 'Built and scaled an e-commerce platform to 4+ lakhs revenue',
      year: '2021-2022',
      icon: Trophy,
      color: 'from-green-500 to-green-600',
      impact: '4+ Lakhs Revenue'
    },
    {
      title: 'Moved to Japan',
      description: 'Relocated to Osaka for professional growth and cultural experience',
      year: '2024',
      icon: MapPin,
      color: 'from-purple-500 to-purple-600',
      impact: 'International Experience'
    },
    {
      title: 'System Architecture Lead',
      description: 'Led redesign of complex .NET systems using DDD and CQRS patterns',
      year: '2025',
      icon: Target,
      color: 'from-emerald-500 to-emerald-600',
      impact: 'Technical Leadership'
    },
    {
      title: 'Cross-Cultural Bridge',
      description: 'Successfully working in Japanese tech environment with N3 proficiency',
      year: '2024-Present',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      impact: 'Cultural Integration'
    }
  ]

  const stats = [
    { number: '4+', label: 'Years Experience', icon: Calendar },
    { number: '15+', label: 'Projects Completed', icon: Code },
    { number: '2', label: 'Countries Worked', icon: Globe },
    { number: '3+', label: 'Languages Spoken', icon: BookOpen }
  ]

  return (
    <section id="achievements" ref={ref} className="section-spacing bg-gradient-to-b from-white to-green-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Achievements & Milestones</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Recognition, growth, and meaningful accomplishments that define my professional journey 
            and personal development.
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Professional Certifications</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`${achievement.bgColor} rounded-3xl p-6 border ${achievement.borderColor} hover-lift`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center mb-4`}>
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-lg">{achievement.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{achievement.issuer}</span>
                  <span className="font-semibold text-gray-700">{achievement.year}</span>
                </div>
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    achievement.category === 'Cloud Architecture' ? 'bg-yellow-100 text-yellow-700' :
                    achievement.category === 'Cloud Fundamentals' ? 'bg-blue-100 text-blue-700' :
                    achievement.category === 'Frontend Development' ? 'bg-cyan-100 text-cyan-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {achievement.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Career Milestones</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: index % 2 === 0 ? -5 : 5 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${milestone.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <milestone.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-800">{milestone.title}</h4>
                      <span className="text-sm text-gray-500">{milestone.year}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{milestone.description}</p>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">{milestone.impact}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Personal Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12 border border-green-100">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">Achievement Philosophy</h3>
            <blockquote className="text-xl text-gray-700 italic leading-relaxed max-w-4xl mx-auto mb-8">
              "Success isn't just about individual accomplishments—it's about the impact we create, 
              the bridges we build between cultures, and the problems we solve for others. 
              Every certification, every project, every milestone is a stepping stone toward 
              making technology more accessible and meaningful."
            </blockquote>
            <div className="flex justify-center space-x-8">
              <div className="flex items-center space-x-2 text-green-600">
                <Award className="w-5 h-5" />
                <span className="font-medium">Continuous Growth</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <Globe className="w-5 h-5" />
                <span className="font-medium">Global Impact</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-600">
                <Users className="w-5 h-5" />
                <span className="font-medium">Collaborative Success</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Achievements

