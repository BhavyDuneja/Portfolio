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
      color: 'from-saffron-500 to-orange-600'
    },
    {
      year: '2024',
      title: 'Graduated & Moved',
      description: 'Completed B.Tech and moved to Japan for new opportunities',
      icon: Globe,
      color: 'from-violet-500 to-purple-600'
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
      color: 'from-saffron-500 to-violet-500'
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
    <section id="about" ref={ref} className="section-spacing bg-dark-400">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold font-display mb-6">
            <span className="gradient-text-saffron">My Story</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            From the bustling streets of Delhi to the innovative tech scene of Osaka,
            my journey has been about embracing change, solving problems, and building bridges between cultures.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column - Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Personal Details Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift">
              <h3 className="text-2xl font-bold font-display mb-6 text-white">Personal Details</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-saffron-500/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-saffron-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Location</p>
                    <p className="text-gray-400">Osaka, Japan (From Delhi, India)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Age & Birthday</p>
                    <p className="text-gray-400">24 years old • January 23, 2001</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Education</p>
                    <p className="text-gray-400">B.Tech in Information Technology from MAIT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Traits */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 hover-lift">
              <h3 className="text-2xl font-bold font-display mb-6 text-white">Core Strengths</h3>
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
                      <span className="font-medium text-gray-300">{trait.trait}</span>
                      <span className="text-sm text-gray-500">{trait.percentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${trait.percentage}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        className="h-2 bg-gradient-to-r from-saffron-500 to-violet-500 rounded-full"
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
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-saffron-500/20 via-saffron-500 to-violet-500 rounded-full" />

            <div className="space-y-8">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={step.year}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="relative flex items-start space-x-4 sm:space-x-6"
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
                    className="flex-1 glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl font-bold text-white">{step.year}</span>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-saffron-500 to-violet-500" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
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
          <div className="glass-card rounded-3xl p-6 sm:p-12">
            <h3 className="text-3xl font-bold font-display mb-6 text-white">My Philosophy</h3>
            <blockquote className="text-xl text-gray-400 italic leading-relaxed max-w-4xl mx-auto">
              "I believe in the power of technology to bridge cultures and solve real-world problems.
              My journey from Delhi to Osaka has taught me that adaptability and continuous learning
              are the keys to success in our ever-evolving tech landscape."
            </blockquote>
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-saffron-500 rounded-full animate-pulse" />
                <div className="w-3 h-3 bg-saffron-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 bg-saffron-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
