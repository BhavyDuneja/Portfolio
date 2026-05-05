'use client'

import { useState } from 'react'
import {
  Brain,
  Megaphone,
  Stethoscope,
  GraduationCap,
  Home as HomeIcon,
  Bot,
  Camera,
  Infinity as InfinityIcon,
} from 'lucide-react'

type ReelItem = {
  image?: string
  title: string
  caption: string
  icon: typeof Brain
  accent: string
  gradient: string
}

const reelItems: ReelItem[] = [
  {
    image: '/images/portfolio/awish-clinic.jpg',
    title: 'Awish Clinic',
    caption: 'Healthcare',
    icon: Stethoscope,
    accent: '#E8A317',
    gradient: 'from-[#E8A317]/35 via-[#E8A317]/15 to-[#0A0A0F]',
  },
  {
    image: '/images/portfolio/ai-automation.jpg',
    title: 'AI Automation',
    caption: 'Voice agents',
    icon: Bot,
    accent: '#6A3DE8',
    gradient: 'from-[#6A3DE8]/40 via-[#6A3DE8]/15 to-[#0A0A0F]',
  },
  {
    image: '/images/portfolio/education-aspire.jpg',
    title: 'Education Aspire',
    caption: 'EdTech',
    icon: GraduationCap,
    accent: '#6A3DE8',
    gradient: 'from-[#6A3DE8]/35 via-[#6A3DE8]/15 to-[#0A0A0F]',
  },
  {
    image: '/images/portfolio/marketing-agency.jpg',
    title: 'Marketing Agency',
    caption: 'End-to-end',
    icon: Megaphone,
    accent: '#E8A317',
    gradient: 'from-[#E8A317]/40 via-[#E8A317]/15 to-[#0A0A0F]',
  },
  {
    image: '/images/portfolio/real-estate.jpg',
    title: 'Real Estate Network',
    caption: 'Multi-agent CRM',
    icon: HomeIcon,
    accent: '#E8A317',
    gradient: 'from-[#E8A317]/25 via-[#6A3DE8]/15 to-[#0A0A0F]',
  },
  {
    image: '/images/portfolio/wisdom-apps.jpg',
    title: 'Wisdom Apps',
    caption: 'Granthas · Ritualist',
    icon: InfinityIcon,
    accent: '#E8A317',
    gradient: 'from-[#E8A317]/30 via-[#6A3DE8]/15 to-[#0A0A0F]',
  },
  {
    image: '/images/portfolio/content-studio.jpg',
    title: 'Content Studio',
    caption: 'Production',
    icon: Camera,
    accent: '#6A3DE8',
    gradient: 'from-[#6A3DE8]/30 via-[#E8A317]/10 to-[#0A0A0F]',
  },
  {
    image: '/images/portfolio/ai-marketing.jpg',
    title: 'AI Marketing',
    caption: 'Smart growth',
    icon: Brain,
    accent: '#6A3DE8',
    gradient: 'from-[#6A3DE8]/35 via-[#E8A317]/10 to-[#0A0A0F]',
  },
]

const FilmCard = ({ item }: { item: ReelItem }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = item.icon
  const showImage = item.image && !imgFailed

  return (
    <div className={`film-card bg-gradient-to-br ${item.gradient}`}>
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      )}

      {!showImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10"
            style={{ backgroundColor: `${item.accent}25` }}
          >
            <Icon className="w-6 h-6" style={{ color: item.accent }} />
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0F]/95 via-[#0A0A0F]/55 to-transparent pt-6 pb-2 px-3">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Icon className="w-3 h-3" style={{ color: item.accent }} />
          <span
            className="text-[9px] uppercase tracking-widest font-semibold"
            style={{ color: item.accent }}
          >
            {item.caption}
          </span>
        </div>
        <div className="reel-card-title text-xs font-semibold leading-tight">
          {item.title}
        </div>
      </div>
    </div>
  )
}

const ReelStrip = () => {
  const half = Math.ceil(reelItems.length / 2)
  const trackItemsA = [...reelItems.slice(0, half), ...reelItems.slice(0, half)]
  const trackItemsB = [...reelItems.slice(half), ...reelItems.slice(half)]

  return (
    <div className="film-reel-rotor">
      <div className="film-strip-frame">
        <div className="film-strip-track film-strip-track-a">
          {trackItemsA.map((item, idx) => (
            <FilmCard key={`a-${item.title}-${idx}`} item={item} />
          ))}
        </div>
      </div>
      <div className="film-strip-frame">
        <div className="film-strip-track film-strip-track-b">
          {trackItemsB.map((item, idx) => (
            <FilmCard key={`b-${item.title}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReelStrip
