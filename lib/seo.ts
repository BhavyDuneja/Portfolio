import type { Metadata } from 'next'

/** Canonical host: the apex domain redirects here, so canonicals, sitemap and schema all use it. */
export const SITE_URL = 'https://www.anantasutra.com'

export interface PageSeo {
  path: string
  /** Page part of the title; the root layout appends " | AnantaSutra". */
  title: string
  description: string
  /** Schema.org Service name, set on live service pages only. */
  service?: string
  /** Placeholder pages stay out of search until they have real content. */
  noindex?: boolean
}

const OG_IMAGE = {
  url: '/images/og-image.png',
  width: 1200,
  height: 630,
  alt: 'AnantaSutra: dedicated experts, embedded in your team',
}

/** One title and description per route (titles ≤ 60 chars rendered, descriptions ≤ 155). */
export const PAGE_SEO: Record<string, PageSeo> = {
  services: {
    path: '/services',
    title: 'Services: Dedicated Experts and AI Automation',
    description: 'Hire a dedicated expert in engineering, AI, design, marketing, video and more, or use AI voice agents from ₹6/min and Recruiter AI at ₹2/lead.',
  },
  'dedicated-experts': {
    path: '/services/dedicated-experts',
    service: 'Dedicated Experts',
    title: 'Hire a Dedicated Expert for Your Team',
    description: 'Embed a vetted expert in your team in about 7 days. Pay their salary plus one transparent fee. No agency markup, no lock-in, 48-hour replacement guarantee.',
  },
  'voice-agents': {
    path: '/services/voice-agents',
    service: 'AI Voice Calling Agents',
    title: 'AI Voice Calling Agents in India from ₹6/min',
    description: 'AI voice agents that make and receive calls 24/7 in Hindi, English and Hinglish. Flat ₹6/min, real-time transcripts and analytics. Book a free demo.',
  },
  'recruiter-ai': {
    path: '/services/recruiter-ai',
    service: 'Recruiter AI',
    title: 'Recruiter AI: Candidate Leads at ₹2 Each',
    description: 'AI recruiting that finds and qualifies candidates, with verified email, LinkedIn profile and work history. ₹2 per enriched lead, no subscription.',
  },
  'gmail-automation': {
    path: '/services/gmail-automation',
    service: 'Gmail Automation',
    title: 'Gmail Automation: AI Replies and Follow-Ups',
    description: 'AI that answers inbound emails, sends follow-up sequences and keeps your inbox organised. Connect your Gmail and watch it run.',
  },
  'social-automation': {
    path: '/services/social-automation',
    service: 'Social Media Automation',
    title: 'Social Media Automation with AI',
    description: 'AI writes, schedules and posts content across Instagram, LinkedIn, YouTube and X in your brand voice. See the features and start automating.',
  },
  'social-media': {
    path: '/services/social-media',
    service: 'Social Media Management',
    title: 'Social Media Management Services',
    description: 'Full-service social media management: strategy, content, daily posting, community engagement and monthly reporting. Start with a free audit.',
  },
  'video-generators': {
    path: '/services/video-generators',
    service: 'AI Video Generators',
    title: 'AI Video Generators for Real Estate and D2C',
    description: 'AI-generated videos for real estate, D2C brands and social media, delivered 48 hours from brief. Vertical, horizontal or square. Request a sample.',
  },
  'content-shooting': {
    path: '/services/content-shooting',
    service: 'Photo and Video Shoots',
    title: 'Professional Photo and Video Shoots',
    description: 'On-location product, corporate, event and social shoots with editing, colour grading and multi-format delivery. Book a shoot.',
  },
  'ai-marketing': {
    path: '/services/ai-marketing',
    service: 'AI Marketing Tools',
    title: 'AI Marketing Tools for Campaign Optimisation',
    description: 'AI tools that monitor Google and Meta campaigns, adjust bids and audiences, generate leads and run A/B tests. See the tools.',
  },
  ecommerce: {
    path: '/services/ecommerce',
    noindex: true,
    title: 'Dedicated E-commerce Experts for D2C Brands',
    description: 'Store operations, catalogue, CRO and retention experts embedded in your team. Pay the expert\'s salary plus one transparent fee.',
  },
  'real-estate': {
    path: '/services/real-estate',
    noindex: true,
    title: 'Dedicated Real Estate Marketing Experts',
    description: 'Funnel, landing-page and lead-generation experts for property businesses, embedded in your team. Pay the expert\'s salary plus one transparent fee.',
  },
  immigration: {
    path: '/services/immigration',
    noindex: true,
    title: 'Immigration Case and Documentation Experts',
    description: 'Case management, documentation and marketing support for immigration firms, from a dedicated expert embedded in your team.',
  },
  business: {
    path: '/services/business',
    noindex: true,
    title: 'Business Operations and Strategy Experts',
    description: 'Analysts, operations and strategy experts embedded in your team. Pay the expert\'s salary plus one transparent fee, no lock-in.',
  },
  academic: {
    path: '/services/academic',
    noindex: true,
    title: 'Academic and Research Experts for Hire',
    description: 'Researchers, subject experts and writers embedded in your team. Pay the expert\'s salary plus one transparent fee, no lock-in.',
  },
  portfolio: {
    path: '/portfolio',
    title: 'Portfolio: Client Results and Case Studies',
    description: 'Real client work with measurable results: Awish Clinic grew from ₹25L to ₹40L a month in 60 days. Browse the websites, funnels and campaigns behind it.',
  },
  testimonials: {
    path: '/testimonials',
    title: 'Client Testimonials and Success Stories',
    description: 'Hear from the founders and business owners who work with AnantaSutra experts, and see the projects behind their results.',
  },
}

/** Self-referencing canonical, unique title/description and matching social tags for one route. */
export function pageMetadata({ path, title, description, noindex }: PageSeo): Metadata {
  const url = `${SITE_URL}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'AnantaSutra', locale: 'en_IN', images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

/** Schema.org Service for a live service page. */
export function serviceJsonLd({ path, description, service }: PageSeo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service,
    description,
    url: `${SITE_URL}${path}`,
    provider: { '@type': 'Organization', name: 'AnantaSutra', url: SITE_URL },
  }
}
