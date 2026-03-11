'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Layers, Zap, Sparkles } from 'lucide-react'

const stats = [
  { value: '\u20B96/min', label: 'Voice Agent Starting Price' },
  { value: '\u20B92/lead', label: 'Recruiter AI Cost' },
  { value: '5+', label: 'Active Ventures' },
  { value: '\u221E', label: 'Wisdom Threads' },
]

const differentiators = [
  {
    icon: Layers,
    title: 'Multi-Domain Expertise',
    description:
      'Unlike single-focus agencies, we operate across AI, marketing, apps, and beyond.',
    accent: '#E8A317',
  },
  {
    icon: Zap,
    title: 'Cost Revolution',
    description:
      'AI solutions at a fraction of industry costs. Voice agents from \u20B96/min, leads from \u20B92.',
    accent: '#6A3DE8',
  },
  {
    icon: Sparkles,
    title: 'Ancient Meets Modern',
    description:
      'We bridge timeless wisdom with cutting-edge technology for holistic solutions.',
    accent: '#E8A317',
  },
]

const AnimatedStat = ({ value, label, delay }: { value: string; label: string; delay: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setDisplayed(true), delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center px-6 py-4"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#E8A317] to-[#F0C040] bg-clip-text text-transparent mb-2 font-display">
        {displayed ? value : ''}
      </div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </motion.div>
  )
}

const WhyChooseUs = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-[#0A0A0F] overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#6A3DE8]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-[#E8A317]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[#E8A317] text-sm font-semibold uppercase tracking-widest block mb-4">
            WHY ANANTASUTRA
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display">
            Numbers That Speak
          </h2>
        </motion.div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={index * 0.15}
            />
          ))}
        </div>

        {/* Differentiator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {differentiators.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 hover:border-opacity-30 transition-all duration-500"
              >
                {/* Hover Glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 60px ${item.accent}10, 0 0 40px ${item.accent}08`,
                  }}
                ></div>

                <div className="relative z-10">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.accent}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: item.accent }} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
