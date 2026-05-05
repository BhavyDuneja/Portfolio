'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Stethoscope,
  GraduationCap,
  Home,
  Target,
  Wrench,
  TrendingUp,
  ImageIcon,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

type Metric = { value: string; label: string }
type CaseStudy = {
  name: string
  industry: string
  icon: typeof Stethoscope
  image: string
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
    industry: 'Healthcare',
    icon: Stethoscope,
    image: '/images/portfolio/awish-clinic.jpg',
    accent: '#E8A317',
    fallbackGradient: 'from-[#E8A317]/30 via-[#E8A317]/10 to-[#0A0A0F]',
    challenge:
      'Walk-in clinic with strong word-of-mouth but zero online presence. Bookings were paper-based, the front desk was overwhelmed by phone calls, and new patients couldn’t find them online.',
    approach: [
      'Designed and built a modern, mobile-first booking website',
      'Integrated a self-service appointment booking system with calendar sync',
      'Automated patient intake forms — cuts in-clinic admin time by 70%',
      'Local SEO + Google Business profile optimization for the catchment area',
      'WhatsApp reminders to reduce no-shows',
    ],
    results: [
      { value: '3x', label: 'Online appointments / month' },
      { value: '60%', label: 'Less phone-call load' },
      { value: 'Top 3', label: 'Local Google ranking' },
      { value: '70%', label: 'Less front-desk admin' },
    ],
    stack: ['Next.js', 'Booking API', 'WhatsApp Cloud API', 'Local SEO'],
  },
  {
    name: 'Education Aspire',
    industry: 'EdTech / Coaching',
    icon: GraduationCap,
    image: '/images/portfolio/education-aspire.jpg',
    accent: '#6A3DE8',
    fallbackGradient: 'from-[#6A3DE8]/30 via-[#6A3DE8]/10 to-[#0A0A0F]',
    challenge:
      'Leads were trickling in, but counsellors were responding 24+ hours later. By the time someone called back, prospects had already enrolled with a competitor. No tracking, no follow-up cadence, no brand polish.',
    approach: [
      'Built a learner-first landing page with course discovery and lead capture',
      'Set up a lightweight CRM tied to the lead form',
      'WhatsApp automation: instant first-touch + counsellor handoff in 5 min',
      'Branding refresh — logo, palette, social media templates',
      'Drip email + WhatsApp follow-up sequences for unconverted leads',
    ],
    results: [
      { value: '5x', label: 'Lead volume' },
      { value: '5 min', label: 'Avg. response time (was 24 h)' },
      { value: '2.4x', label: 'Lead→enrolment conversion' },
      { value: '₹0', label: 'Spent on extra counsellors' },
    ],
    stack: ['Next.js', 'CRM Integration', 'WhatsApp Automation', 'Email Drip'],
  },
  {
    name: 'Real Estate Network',
    industry: 'Real Estate',
    icon: Home,
    image: '/images/portfolio/real-estate.jpg',
    accent: '#E8A317',
    fallbackGradient: 'from-[#E8A317]/20 via-[#6A3DE8]/15 to-[#0A0A0F]',
    challenge:
      'A network of independent agents across multiple cities — each with their own listings, none with a polished web presence. Instagram ads were burning money on unqualified tyre-kickers.',
    approach: [
      'Built individual listing websites for each agent with shared CMS',
      'Deployed an AI lead qualifier — chats with prospects, scores intent, books site visits only for serious buyers',
      'Rebuilt Instagram ad creative + landing page funnels',
      'Centralized CRM so agents see all their leads in one dashboard',
    ],
    results: [
      { value: '12+', label: 'Active agents on the platform' },
      { value: '40%', label: 'Closure-rate boost' },
      { value: '3.2x', label: 'Qualified-lead ratio' },
      { value: '₹68/lead', label: 'Down from ₹210/lead' },
    ],
    stack: ['Next.js', 'AI Lead Qualifier', 'Instagram Ads', 'Multi-tenant CRM'],
  },
]

const CaseImage = ({ study }: { study: CaseStudy }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = study.icon

  return (
    <div
      className={`relative h-72 md:h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br ${study.fallbackGradient} border border-white/[0.08]`}
    >
      {!imgFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={study.image}
          alt={`${study.name} project preview`}
          className="absolute inset-0 w-full h-full object-cover opacity-95"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      )}

      {imgFailed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10"
            style={{ backgroundColor: `${study.accent}20` }}
          >
            <ImageIcon className="w-11 h-11" style={{ color: study.accent }} />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/70 via-transparent to-transparent pointer-events-none"></div>

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
        <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-6">
          {study.name}
        </h2>

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
