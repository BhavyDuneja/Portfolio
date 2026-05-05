'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Brain,
  Megaphone,
  BookOpen,
  ShoppingBag,
  Building2,
  Globe,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Compass,
  HeartHandshake,
  UserCheck,
} from 'lucide-react'
import Link from 'next/link'

const activeServices = [
  {
    icon: Brain,
    title: 'AI Automation & Intelligence',
    description:
      'Voice calling agents starting at \u20B96/min. Video generators, social media automation, Gmail automation, AI marketing tools, and recruiter AI at \u20B92/lead.',
    accent: '#E8A317',
    tags: ['Voice Agents', 'Video AI', 'Marketing AI', 'Recruiter AI'],
    link: '/services/ai-automation',
  },
  {
    icon: Megaphone,
    title: 'Creative & Marketing Agency',
    description:
      'End-to-end marketing support. From professional shooting and content creation to complete social media management and brand strategy.',
    accent: '#6A3DE8',
    tags: ['Content', 'Social Media', 'Branding', 'Strategy'],
    link: '/services/marketing',
  },
  {
    icon: BookOpen,
    title: 'Wisdom & Lifestyle Apps',
    description:
      'Granthas \u2014 all Hindu scriptures in one place. Ritualist \u2014 your free daily activity companion. Connecting ancient wisdom with modern living.',
    accent: '#E8A317',
    tags: ['Granthas', 'Ritualist', 'Free Apps'],
    link: '/apps',
  },
  {
    icon: Compass,
    title: 'Strategic Consultation',
    description:
      'Tech roadmaps, architecture reviews, and growth strategy. Sometimes you don\u2019t need to build \u2014 you need to think clearly first. Senior advisors who\u2019ve shipped at scale.',
    accent: '#6A3DE8',
    tags: ['Tech Strategy', 'Architecture', 'Growth Audit', 'Roadmaps'],
    link: '/contact',
  },
  {
    icon: HeartHandshake,
    title: 'Managed In-House Teams',
    description:
      'We assemble and lead a delivery team that plugs into your business as part of your in-house team. We manage them end-to-end and guarantee project completion \u2014 you get the output, we own the process.',
    accent: '#E8A317',
    tags: ['Embedded Team', 'End-to-End Mgmt', 'Delivery Guarantee', 'Scalable'],
    link: '/contact',
  },
  {
    icon: UserCheck,
    title: 'Dedicated Experts On Demand',
    description:
      'Individual senior experts embedded into your team \u2014 engineers, performance marketers, designers, project managers. Ramp up in 7 days. Replace in 48 hours.',
    accent: '#6A3DE8',
    tags: ['Engineers', 'Marketers', 'Designers', '7-day Setup'],
    link: '/services/dedicated-experts',
  },
]

const comingSoonServices = [
  { icon: ShoppingBag, title: 'E-commerce' },
  { icon: Building2, title: 'Real Estate' },
  { icon: Globe, title: 'Immigration Support' },
  { icon: Briefcase, title: 'Business Solutions' },
  { icon: GraduationCap, title: 'Academic Solutions' },
]

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-[#E8A317] text-sm font-semibold uppercase tracking-widest block mb-4">
            OUR UNIVERSE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display">
            A Constellation of Ventures
          </h2>
        </motion.div>

        {/* Active Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {activeServices.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 hover:border-opacity-30 transition-all duration-500"
                style={{
                  ['--glow-color' as string]: service.accent,
                }}
              >
                {/* Hover Glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 60px ${service.accent}10, 0 0 40px ${service.accent}08`,
                  }}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${service.accent}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: service.accent }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed mb-6">{service.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full border border-white/10 text-gray-400 bg-white/[0.03]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  <Link
                    href={service.link}
                    className="inline-flex items-center space-x-2 text-sm font-medium transition-colors duration-300 group-hover:translate-x-1"
                    style={{ color: service.accent }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-400 mb-6 text-center">
            Expanding Our Universe
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center flex-wrap">
            {comingSoonServices.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex-shrink-0 relative bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-4 flex items-center space-x-3 min-w-[180px] mt-3 mr-2"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-400 text-sm font-medium">{service.title}</span>
                  <span className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full bg-[#6A3DE8]/20 text-[#6A3DE8] border border-[#6A3DE8]/30 font-medium">
                    Soon
                  </span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
