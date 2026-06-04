'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'
import { clients, clientIndustries, type Client } from '@/lib/clients'

const ClientLogo = ({ client }: { client: Client }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = client.icon

  return (
    <div
      className="relative h-40 overflow-hidden border-b border-white/[0.06] bg-gradient-to-br"
      style={{
        backgroundImage: `linear-gradient(135deg, ${client.accent}1a, transparent 70%)`,
      }}
    >
      {/* Industry badge */}
      <span
        className="absolute top-4 right-4 z-10 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border border-white/10 font-semibold"
        style={{ color: client.accent, backgroundColor: `${client.accent}15` }}
      >
        {client.industry}
      </span>

      {/* Logo on a clean plate so any brand colour reads on the dark UI */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg shadow-black/30 p-4 w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              className="max-w-full max-h-full object-contain"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
          ) : (
            <Icon className="w-10 h-10" style={{ color: client.accent }} />
          )}
        </div>
      </div>
    </div>
  )
}

const ClientCard = ({ client, index }: { client: Client; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12 }}
      className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col"
    >
      <ClientLogo client={client} />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 60px ${client.accent}10, 0 0 40px ${client.accent}08`,
        }}
      ></div>

      <div className="relative z-10 p-7 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <MapPin className="w-3 h-3" />
          <span>{client.location}</span>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-5 flex-1">
          {client.blurb}
        </p>

        {/* Services delivered */}
        <div className="flex flex-wrap gap-2 mb-5">
          {client.services.map((s) => (
            <span
              key={s}
              className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 text-gray-400 bg-white/[0.03]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Headline result, where we have a real number */}
        {client.stat && (
          <div className="pt-4 border-t border-white/[0.06]">
            <div
              className="text-2xl font-bold font-display mb-1"
              style={{ color: client.accent }}
            >
              {client.stat.value}
            </div>
            <div className="text-xs text-gray-500">{client.stat.label}</div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const Portfolio = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

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
            built, scaled, and supported — across {clientIndustries.length}{' '}
            industries and three continents.
          </p>
        </motion.div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-20">
          {clients.map((client, index) => (
            <ClientCard key={client.slug} client={client} index={index} />
          ))}
        </div>

        {/* Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 backdrop-blur-sm text-center"
        >
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-6">
            Industries we&apos;ve shipped in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-8">
            {clientIndustries.map((industry) => (
              <span
                key={industry}
                className="text-gray-500 font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#E8A317]" />
                {industry}
              </span>
            ))}
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
