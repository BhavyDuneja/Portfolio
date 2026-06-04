'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Stethoscope,
  GraduationCap,
  Plane,
  Target,
  Wrench,
  TrendingUp,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'

type Metric = { value: string; label: string }
type CaseStudy = {
  name: string
  industry: string
  location: string
  icon: LucideIcon
  logo: string
  accent: string
  fallbackGradient: string
  challenge: string
  approach: string[]
  results: Metric[]
  stack: string[]
}

const caseStudies: CaseStudy[] = [
  {
    name: 'Awish Clinic',
    industry: 'Dermatology',
    location: 'Delhi · Jaipur · Vrindavan',
    icon: Stethoscope,
    logo: '/images/clients/awish-clinic.png',
    accent: '#E8A317',
    fallbackGradient: 'from-[#E8A317]/30 via-[#E8A317]/10 to-[#0A0A0F]',
    challenge:
      'A multi-city dermatology practice with strong clinical reputation but no digital engine behind it — no website, no lead capture, no way to convert online interest into booked patients across three cities.',
    approach: [
      'Designed and built the website end-to-end — design, development and testing',
      'Built a personalised landing-page generation tool for campaigns and locations',
      'Set up and managed the CRM so every enquiry is tracked and followed up',
      'Ran full advertising management across channels to drive qualified patients',
    ],
    results: [
      { value: '₹25L → ₹30L', label: 'Monthly revenue, month 1' },
      { value: '₹30L → ₹40L', label: 'Monthly revenue, month 2' },
      { value: '+60%', label: 'Revenue growth in 2 months' },
      { value: '3 cities', label: 'Delhi · Jaipur · Vrindavan' },
    ],
    stack: ['Website', 'Landing-Page Generator', 'CRM', 'Ad Management'],
  },
  {
    name: 'Education Aspire',
    industry: 'EdTech',
    location: 'Faridabad',
    icon: GraduationCap,
    logo: '/images/clients/education-aspire.png',
    accent: '#6A3DE8',
    fallbackGradient: 'from-[#6A3DE8]/30 via-[#6A3DE8]/10 to-[#0A0A0F]',
    challenge:
      'An education brand with no digital home and slow, manual lead follow-up. Enquiries came in across channels with no single place to capture them and no instant response to keep prospects warm.',
    approach: [
      'Built the website from scratch — design, development and testing',
      'Integrated WhatsApp automation for instant, round-the-clock first response',
      'Full WATI setup and integration tied to the enquiry flow',
      'Automated follow-up so no lead goes cold while counsellors are busy',
    ],
    results: [
      { value: 'Built', label: 'Website from scratch' },
      { value: 'WATI', label: 'WhatsApp automation, live' },
      { value: '24/7', label: 'Instant first response' },
      { value: '1 flow', label: 'Capture → automate → follow up' },
    ],
    stack: ['Website', 'WhatsApp Automation', 'WATI Integration'],
  },
  {
    name: 'Giant Migrations',
    industry: 'Immigration',
    location: 'Qatar · UAE',
    icon: Plane,
    logo: '/images/clients/giant-migrations.png',
    accent: '#E8A317',
    fallbackGradient: 'from-[#E8A317]/20 via-[#6A3DE8]/15 to-[#0A0A0F]',
    challenge:
      'An immigration firm operating across Qatar and the UAE, handling high volumes of enquiries and complex legal casework manually — with no website to build trust and no system to triage incoming clients at scale.',
    approach: [
      'Designed and built the website from scratch — design, development and testing',
      'Deployed AI voice agents to handle first-touch enquiries and qualification',
      'Automated immigration legal-matter handling to keep cases moving',
      'Built for a multi-country audience across Qatar and the UAE',
    ],
    results: [
      { value: 'Built', label: 'Website from scratch' },
      { value: 'AI Voice', label: 'Agents handling intake' },
      { value: 'Legal', label: 'Matter handling automated' },
      { value: '2 markets', label: 'Qatar · UAE' },
    ],
    stack: ['Website', 'AI Voice Agents', 'Legal Automation'],
  },
]

const CaseImage = ({ study }: { study: CaseStudy }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = study.icon

  return (
    <div
      className={`relative h-72 md:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br ${study.fallbackGradient} border border-white/[0.08]`}
    >
      {/* Brand logo on a clean plate so the real mark reads on the dark UI */}
      <div className="absolute inset-0 flex items-center justify-center p-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-8 w-44 h-44 md:w-52 md:h-52 flex items-center justify-center">
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={study.logo}
              alt={`${study.name} logo`}
              className="max-w-full max-h-full object-contain"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
          ) : (
            <Icon className="w-16 h-16" style={{ color: study.accent }} />
          )}
        </div>
      </div>

      <div
        className="absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10"
        style={{ backgroundColor: `${study.accent}25` }}
      >
        <Icon className="w-6 h-6" style={{ color: study.accent }} />
      </div>

      <span
        className="absolute top-4 right-4 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border border-white/10 font-semibold"
        style={{ color: study.accent, backgroundColor: `${study.accent}15` }}
      >
        {study.industry}
      </span>
    </div>
  )
}

const CaseStudyBlock = ({
  study,
  index,
}: {
  study: CaseStudy
  index: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const reverse = index % 2 === 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
    >
      <div className={reverse ? 'lg:order-2' : 'lg:order-1'}>
        <CaseImage study={study} />
      </div>

      <div className={reverse ? 'lg:order-1' : 'lg:order-2'}>
        <span
          className="text-xs uppercase tracking-widest font-semibold mb-3 block"
          style={{ color: study.accent }}
        >
          {study.industry}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-2">
          {study.name}
        </h2>
        <p className="text-sm text-gray-500 mb-6">{study.location}</p>

        {/* Challenge */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" style={{ color: study.accent }} />
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Challenge
            </span>
          </div>
          <p className="text-gray-300 leading-relaxed">{study.challenge}</p>
        </div>

        {/* Approach */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4" style={{ color: study.accent }} />
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              What we built
            </span>
          </div>
          <ul className="space-y-2">
            {study.approach.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-gray-300 leading-relaxed"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: study.accent }}
                ></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: study.accent }} />
            <span className="text-sm font-semibold text-white uppercase tracking-wider">
              Results
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {study.results.map((m) => (
              <div
                key={m.label}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4"
              >
                <div
                  className="text-2xl font-bold font-display mb-1"
                  style={{ color: study.accent }}
                >
                  {m.value}
                </div>
                <div className="text-xs text-gray-400 leading-snug">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div>
          <div className="flex flex-wrap gap-2">
            {study.stack.map((s) => (
              <span
                key={s}
                className="text-xs px-3 py-1 rounded-full border border-white/10 text-gray-400 bg-white/[0.03]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const CaseStudiesDetailed = () => {
  return (
    <section className="relative py-24 md:py-32 bg-[#0A0A0F] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[#6A3DE8]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-[#E8A317]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-[#E8A317] text-sm font-semibold uppercase tracking-widest block mb-4">
            CASE STUDIES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            How we delivered
          </h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {caseStudies.map((study, index) => (
            <CaseStudyBlock key={study.name} study={study} index={index} />
          ))}
        </div>

        {/* CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 md:mt-32 glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#E8A317]/40 to-transparent" />
          <p className="text-[#E8A317] uppercase tracking-[0.2em] text-sm font-medium mb-4">
            Your turn
          </p>
          <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
            Want to be our next case study?
          </h3>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
            Healthcare, education, real estate, e-commerce, coaching — if you sell
            something, we can help you sell more of it. Faster.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              <span>Start the conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="btn-outline">
              <span>See all services</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CaseStudiesDetailed
