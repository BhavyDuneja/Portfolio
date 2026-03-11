'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { ChevronDown, MapPin, Calendar, Mail, ArrowRight, Download } from 'lucide-react'
import Image from 'next/image'

const Hero = () => {
  const [currentText, setCurrentText] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  const texts = [
    'Software Engineer',
    'Full Stack Developer',
    'Cloud Architect',
    'System Designer',
    'Problem Solver',
  ]

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [texts.length])

  const scrollToAbout = () => {
    const element = document.querySelector('#about')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-950 pt-16"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-saffron-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 }
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <div className="w-2 h-2 bg-saffron-500 rounded-full animate-pulse" />
              <span className="text-saffron-500 font-medium">Hello, I'm</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-bold font-display leading-tight"
            >
              <span className="gradient-text-saffron">Bhavya</span>
              <br />
              <span className="text-white">Duneja</span>
            </motion.h1>

            {/* Dynamic Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="h-16 flex items-center"
            >
              <span className="text-2xl lg:text-3xl font-semibold text-gray-400">
                I'm a{' '}
                <motion.span
                  key={currentText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-saffron-500 inline-block"
                >
                  {texts[currentText]}
                </motion.span>
              </span>
            </motion.div>

            {/* Professional Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-lg text-gray-400 leading-relaxed max-w-lg"
            >
              Software Engineer with expertise in .NET, ReactJS, AWS, and Azure.
              Currently based in Osaka, Japan, bringing innovative solutions
              and bridging cultures through technology.
            </motion.p>

            {/* Location & Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-saffron-500" />
                <span>Currently in Osaka, Japan</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Calendar className="w-5 h-5 text-saffron-500" />
                <span>24 years old • Born January 23, 2001</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-saffron-500" />
                <span>contact@anantasutra.com</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToAbout}
                className="btn-primary px-8 py-4 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Explore My Journey</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@anantasutra.com&su=Let's Start a Conversation&body=Hi Anantasutra Team,%0D%0A%0D%0AI came across Anantasutra and would like to discuss potential technology solutions for my business.%0D%0A%0D%0ABest regards,"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline px-8 py-4 font-semibold rounded-full transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start a Conversation</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Professional Portrait */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            {/* Main Portrait Container */}
            <div className="relative w-full h-[600px] flex items-center justify-center">
              {/* Professional Portrait */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Your Professional Portrait */}
                <div className="w-full h-full relative">
                  <Image
                    src="/images/portrait.jpg"
                    alt="Bhavya Duneja - Software Engineer"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-dark-400 to-dark-950 flex items-center justify-center" style={{ display: 'none' }}>
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-saffron-500 to-violet-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">BD</span>
                      </div>
                      <p className="text-gray-400 text-sm">Your Professional Portrait</p>
                      <p className="text-gray-500 text-xs mt-1">Upload your image to public/portrait.jpg</p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-saffron-500 rounded-full animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-violet-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </motion.div>

              {/* Floating Info Cards */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-8 -left-8 w-64 h-32 glass-card rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-saffron-500 rounded-full" />
                  <span className="text-sm font-medium text-gray-400">Current Role</span>
                </div>
                <h3 className="text-lg font-bold text-white">Software Engineer</h3>
                <p className="text-sm text-gray-400">Oak Clinic Group, Inc.</p>
                <div className="mt-2 flex space-x-2">
                  <span className="px-2 py-1 bg-saffron-500/10 text-saffron-500 text-xs rounded-full">.NET</span>
                  <span className="px-2 py-1 bg-saffron-500/10 text-saffron-500 text-xs rounded-full">F#</span>
                  <span className="px-2 py-1 bg-saffron-500/10 text-saffron-500 text-xs rounded-full">Azure</span>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                className="absolute top-32 -right-12 w-56 h-28 glass-card rounded-2xl shadow-xl p-4"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-violet-500 rounded-full" />
                  <span className="text-xs font-medium text-gray-400">Education</span>
                </div>
                <h4 className="text-sm font-bold text-white">B.Tech in ITE</h4>
                <p className="text-xs text-gray-400">MAIT, Delhi</p>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4
                }}
                className="absolute bottom-20 -left-12 w-60 h-32 glass-card rounded-2xl shadow-xl p-5"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full" />
                  <span className="text-xs font-medium text-gray-400">Location</span>
                </div>
                <h4 className="text-sm font-bold text-white">Osaka, Japan</h4>
                <p className="text-xs text-gray-400">From Delhi, India</p>
                <div className="mt-2 flex space-x-1">
                  <span className="px-2 py-1 bg-saffron-500/10 text-saffron-500 text-xs rounded-full">JLPT N3</span>
                  <span className="px-2 py-1 bg-saffron-500/10 text-saffron-500 text-xs rounded-full">English</span>
                </div>
              </motion.div>

              {/* Achievement Badge */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-saffron-500 to-violet-500 rounded-full shadow-2xl flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">AWS</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={scrollToAbout}
            className="flex flex-col items-center space-y-2 text-gray-500 hover:text-saffron-500 transition-colors duration-300"
          >
            <span className="text-sm font-medium">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
