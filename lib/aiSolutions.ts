import {
  Phone,
  Users,
  Share2,
  Mail,
  Video,
  Target,
  type LucideIcon,
} from 'lucide-react'

export type AiSolution = {
  slug: string
  name: string
  /** The solution's own service page. */
  href: string
  icon: LucideIcon
  accent: string
  blurb: string
  /** Transparent per-use price where one exists; shown as a badge. */
  price?: string
}

const SAFFRON = '#E8A317'
const VIOLET = '#6A3DE8'

/** Hub page that presents the whole AI suite. */
export const AI_SOLUTIONS_HUB = '/services/ai-automation'

/**
 * The second thing AnantaSutra offers alongside dedicated experts: AI solutions
 * that take over a job and run it around the clock. Where an expert is a person
 * on the client's team, a solution is software the client pays for per use.
 */
export const aiSolutions: AiSolution[] = [
  {
    slug: 'voice-agents',
    name: 'AI Voice Agents',
    href: '/services/voice-agents',
    icon: Phone,
    accent: SAFFRON,
    price: '₹6/min',
    blurb:
      'Make and receive calls 24/7 in Hindi, English and Hinglish, with live transcripts and analytics.',
  },
  {
    slug: 'recruiter-ai',
    name: 'Recruiter AI',
    href: '/services/recruiter-ai',
    icon: Users,
    accent: VIOLET,
    price: '₹2/lead',
    blurb:
      'Finds and qualifies candidates, with verified email, LinkedIn profile and work history.',
  },
  {
    slug: 'social-automation',
    name: 'Social Media Automation',
    href: '/services/social-automation',
    icon: Share2,
    accent: SAFFRON,
    blurb:
      'Writes, schedules and posts across Instagram, LinkedIn, YouTube and X in your brand voice.',
  },
  {
    slug: 'gmail-automation',
    name: 'Gmail Automation',
    href: '/services/gmail-automation',
    icon: Mail,
    accent: VIOLET,
    blurb:
      'Answers inbound email, runs follow-up sequences and keeps your inbox organised.',
  },
  {
    slug: 'video-generators',
    name: 'AI Video Generators',
    href: '/services/video-generators',
    icon: Video,
    accent: SAFFRON,
    blurb:
      'Videos for real estate, D2C brands and social media, delivered 48 hours from brief.',
  },
  {
    slug: 'ai-marketing',
    name: 'AI Marketing Tools',
    href: '/services/ai-marketing',
    icon: Target,
    accent: VIOLET,
    blurb:
      'Monitors Google and Meta campaigns, adjusts bids and audiences, and runs A/B tests.',
  },
]
