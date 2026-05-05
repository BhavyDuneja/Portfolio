'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Stethoscope,
  GraduationCap,
  Home,
  CheckCircle2,
  ImageIcon,
} from 'lucide-react'

type Metric = { value: string; label: string }
type Client = {
  name: string
  industry: string
  icon: typeof Stethoscope
  image: string
  accent: string
  fallbackGradient: string
  summary: string
  services: string[]
  metrics: Metric[]
  link?: string
}

const clients: Client[] = [
  {
    name: 'Awish Clinic',
    industry: 'Healthcare',
    icon: Stethoscope,
    image: '/images/portfolio/awish-clinic.jpg',
    accent: '#E8A317',
    fallbackGradient:
      'from-[#E8A317]/30 via-[#E8A317]/10 to-[#0A0A0F]',
    summary:
      'Built a complete digital presence for a multi-specialty clinic — modern booking website, patient intake automation, and SEO that actually brings in walk-ins.',
    services: ['Website', 'Booking System', 'Patient Intake', 'Local SEO'],
    metrics: [
      { value: '3x', label: 'Online appointments' },
      { value: '60%', label: 'Less phone load' },
    ],
  },
  {
    name: 'Education Aspire',
    industry: 'EdTech / Coaching',
    icon: GraduationCap,
    image: '/images/portfolio/education-aspire.jpg',
    accent: '#6A3DE8',
    fallbackGradient:
      'from-[#6A3DE8]/30 via-[#6A3DE8]/10 to-[#0A0A0F]',
    summary:
      'Launched a learner-first website with course discovery, lead capture, and an automated counsellor follow-up flow that closes admissions faster.',
    services: ['Landing Page', 'Lead CRM', 'WhatsApp Automation', 'Branding'],
    metrics: [
      { value: '5x', label: 'Lead volume' },
      { value: '5 min', label: 'Avg response time' },
    ],
  },
  {
    name: 'Real Estate Network',
    industry: 'Real Estate',
    icon: Home,
    image: '/images/portfolio/real-estate.jpg',
    accent: '#E8A317',
    fallbackGradient:
      'from-[#E8A317]/20 via-[#6A3DE8]/15 to-[#0A0A0F]',
    summary:
      'Multiple agents across cities. Listing websites, AI-powered lead qualification, and Instagram campaigns that turn scrolls into site visits.',
    services: ['Listing Sites', 'AI Lead Qualifier', 'Instagram Ads', 'CRM'],
    metrics: [
      { value: '12+', label: 'Active agents' },
      { value: '40%', label: 'Closure rate boost' },
    ],
  },
]

const ClientCover = ({ client }: { client: Client }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = client.icon

  return (
    <div
      className={`relative h-52 overflow-hidden bg-gradient-to-br ${client.fallbackGradient}`}
    >
      {!imgFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={client.image}
          alt={`${client.name} project preview`}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      )}

      {imgFailed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10"
            style={{ backgroundColor: `${client.accent}20` }}
          >
            <ImageIcon className="w-9 h-9" style={{ color: client.accent }} />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent pointer-events-none"></div>

      <div
        className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10"
        style={{ backgroundColor: `${client.accent}25` }}
      >
        <Icon className="w-6 h-6" style={{ color: client.accent }} />
      </div>

      <span
        className="absolute top-4 right-4 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border border-white/10 font-semibold"
        style={{ color: client.accent, backgroundColor: `${client.accent}15` }}
      >
        {client.industry}
      </span>
    </div>
  )
}

const Portfolio = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section
      id="portfolio"
      ref={ref}
      className="relative py-24 md:py-32 bg-[#0A0A0F] overflow-hidden"
    >
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] right-[5%] w-[500px] h-[500px] bg-[#E8A317]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] bg-[#6A3DE8]/5 rounded-full blur-[120px]"></div>
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
            OUR PORTFOLIO
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display mb-6">
            Real Work. Real Clients. Real Results.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We don&apos;t do demo projects. Here are businesses we&apos;ve actually
            built, scaled, and supported.
          </p>
        </motion.div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col"
            >
              <ClientCover client={client} />

              {/* Hover Glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 60px ${client.accent}10, 0 0 40px ${client.accent}08`,
                }}
              ></div>

              <div className="relative z-10 p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {client.name}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6 flex-1">
                  {client.summary}
                </p>

                {/* Services delivered */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {client.services.map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1 rounded-full border border-white/10 text-gray-400 bg-white/[0.03]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/[0.06]">
                  {client.metrics.map((m) => (
                    <div key={m.label}>
                      <div
                        className="text-2xl font-bold mb-1 font-display"
                        style={{ color: client.accent }}
                      >
                        {m.value}
                      </div>
                      <div className="text-xs text-gray-500">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 backdrop-blur-sm text-center"
        >
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-6">
            Industries we&apos;ve shipped in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 mb-8">
            {['Healthcare', 'Education', 'Real Estate', 'E-commerce', 'Coaching'].map(
              (industry) => (
                <span
                  key={industry}
                  className="text-gray-500 font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#E8A317]" />
                  {industry}
                </span>
              )
            )}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 text-[#E8A317] font-medium hover:translate-x-1 transition-transform"
          >
            <span>Want to be our next success story?</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Portfolio
