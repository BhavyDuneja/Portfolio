'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Calendar, GraduationCap, Heart, Code, Globe, Users, Award } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const journeySteps = [
    {
      year: '2001',
      title: 'Born in Delhi',
      description: 'Started my journey in the capital of India',
      icon: Heart,
      color: 'from-pink-400 to-pink-600'
    },
    {
      year: '2020',
      title: 'Started B.Tech',
      description: 'Began my engineering journey at MAIT in Information Technology',
      icon: GraduationCap,
      color: 'from-blue-400 to-blue-600'
    },
    {
      year: '2021',
      title: 'First Startup',
      description: 'Founded Fit-First, an e-commerce startup, achieving 4+ lakhs in business',
      icon: Users,
      color: 'from-green-400 to-green-600'
    },
    {
      year: '2024',
      title: 'Graduated & Moved',
      description: 'Completed B.Tech and moved to Japan for new opportunities',
      icon: Globe,
      color: 'from-purple-400 to-purple-600'
    },
    {
      year: '2024',
      title: 'Professional Journey',
      description: 'Started as System Engineer at MegaGroup, working with Java, Go, and AWS',
      icon: Code,
      color: 'from-orange-400 to-orange-600'
    },
    {
      year: '2025',
      title: 'Current Role',
      description: 'Software Engineer at Oak Clinic Group, specializing in .NET and F#',
      icon: Award,
      color: 'from-emerald-400 to-emerald-600'
    }
  ]

  const personalTraits = [
    { trait: 'Adaptability', percentage: 95 },
    { trait: 'Problem Solving', percentage: 90 },
    { trait: 'Team Collaboration', percentage: 88 },
    { trait: 'Continuous Learning', percentage: 92 },
    { trait: 'Cultural Bridge', percentage: 85 }
  ]

  return (
    <section id="about" ref={ref} className="section-spacing bg-gradient-to-b from-white to-green-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">My Story</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From the bustling streets of Delhi to the innovative tech scene of Osaka, 
            my journey has been about embracing change, solving problems, and building bridges between cultures.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Personal Details Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 hover-lift">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Personal Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p className="text-gray-600">Osaka, Japan (From Delhi, India)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Age & Birthday</p>
                    <p className="text-gray-600">24 years old • January 23, 2001</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Education</p>
                    <p className="text-gray-600">B.Tech in Information Technology from MAIT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Traits */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 hover-lift">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Core Strengths</h3>
              <div className="space-y-4">
                {personalTraits.map((trait, index) => (
                  <motion.div
                    key={trait.trait}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{trait.trait}</span>
                      <span className="text-sm text-gray-500">{trait.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${trait.percentage}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Journey Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-600 rounded-full" />
            
            <div className="space-y-8">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={step.year}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="relative flex items-start space-x-6"
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl font-bold text-gray-800">{step.year}</span>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-green-400 to-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-12 border border-green-100">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">My Philosophy</h3>
            <blockquote className="text-xl text-gray-700 italic leading-relaxed max-w-4xl mx-auto">
              "I believe in the power of technology to bridge cultures and solve real-world problems. 
              My journey from Delhi to Osaka has taught me that adaptability and continuous learning 
              are the keys to success in our ever-evolving tech landscape."
            </blockquote>
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About

