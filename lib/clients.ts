import {
  Stethoscope,
  GraduationCap,
  Plane,
  Megaphone,
  Car,
  Building2,
  Smile,
  Camera,
  Bot,
  BookOpen,
  Truck,
  HardHat,
  Gem,
  type LucideIcon,
} from 'lucide-react'

export type ClientStat = { value: string; label: string }

export type Client = {
  slug: string
  name: string
  industry: string
  location: string
  /** Real brand logo, served from /public/images/clients */
  logo: string
  /** Accent colour pulled from the AnantaSutra palette */
  accent: string
  icon: LucideIcon
  /** What we actually delivered */
  blurb: string
  services: string[]
  /** Headline result — only present where we have a real number */
  stat?: ClientStat
}

const SAFFRON = '#E8A317'
const VIOLET = '#6A3DE8'

/**
 * Real clients AnantaSutra has worked with. Logos are the brands' own
 * favicons/marks (see /public/images/clients), not stock or AI imagery.
 */
export const clients: Client[] = [
  {
    slug: 'awish-clinic',
    name: 'Awish Clinic',
    industry: 'Dermatology',
    location: 'Delhi · Jaipur · Vrindavan',
    logo: '/images/clients/awish-clinic.png',
    accent: SAFFRON,
    icon: Stethoscope,
    blurb:
      'End-to-end website — design, development and testing — plus a personalised landing-page generator, CRM management, and full advertising management.',
    services: ['Website', 'Landing-Page Generator', 'CRM', 'Ad Management'],
    stat: { value: '₹25L → ₹40L', label: 'Monthly revenue in 2 months' },
  },
  {
    slug: 'education-aspire',
    name: 'Education Aspire',
    industry: 'EdTech',
    location: 'Faridabad',
    logo: '/images/clients/education-aspire.png',
    accent: VIOLET,
    icon: GraduationCap,
    blurb:
      'Website built from scratch — design, development and testing — with WhatsApp automation and full WATI integration and setup.',
    services: ['Website', 'WhatsApp Automation', 'WATI Integration'],
  },
  {
    slug: 'giant-migrations',
    name: 'Giant Migrations',
    industry: 'Immigration',
    location: 'Qatar · UAE',
    logo: '/images/clients/giant-migrations.png',
    accent: SAFFRON,
    icon: Plane,
    blurb:
      'Full website from scratch, AI voice agents for client intake, and automated handling of immigration legal matters.',
    services: ['Website', 'AI Voice Agents', 'Legal Automation'],
  },
  {
    slug: 'botwot',
    name: 'BotWot',
    industry: 'AI',
    location: 'India · UAE · Nigeria',
    logo: '/images/clients/botwot.png',
    accent: VIOLET,
    icon: Bot,
    blurb:
      'Marketing across three markets that brought in multiple high-value clients for an AI products company.',
    services: ['Marketing', 'Lead Generation'],
    stat: { value: '₹23L', label: 'Avg. deal size closed' },
  },
  {
    slug: 'zoom-wheels',
    name: 'Zoom Wheels',
    industry: 'Automotive',
    location: 'NSP, Delhi',
    logo: '/images/clients/zoom-wheels.png',
    accent: SAFFRON,
    icon: Car,
    blurb:
      'Ad management and marketing for a car dealership — sharper targeting and creative that turns interest into walk-ins.',
    services: ['Ad Management', 'Marketing'],
    stat: { value: '+46%', label: 'Extra revenue growth' },
  },
  {
    slug: 'royal-properties',
    name: 'Royal Properties',
    industry: 'Real Estate',
    location: 'NSP, Delhi',
    logo: '/images/clients/royal-properties.png',
    accent: VIOLET,
    icon: Building2,
    blurb:
      'High-converting landing pages and a CTA-driven funnel built for a property business.',
    services: ['Landing Pages', 'CTA Funnel'],
    stat: { value: '+38%', label: 'Traffic increase' },
  },
  {
    slug: 'bluemoon-marketing',
    name: 'BlueMoon Marketing',
    industry: 'Advertising',
    location: 'Delhi',
    logo: '/images/clients/bluemoon-marketing.png',
    accent: SAFFRON,
    icon: Megaphone,
    blurb:
      'Advertising and marketing partnership — campaign strategy and creative execution.',
    services: ['Advertising', 'Marketing'],
  },
  {
    slug: 'smile-with-kris',
    name: 'Smile With Kris',
    industry: 'Dental',
    location: 'United Kingdom',
    logo: '/images/clients/smile-with-kris.png',
    accent: VIOLET,
    icon: Smile,
    blurb:
      'Personalised video editing — crafting engaging, on-brand content for a UK dental practice.',
    services: ['Video Editing', 'Content'],
  },
  {
    slug: 'walk-through-my-lens',
    name: 'Walk Through My Lens',
    industry: 'Travel',
    location: 'London',
    logo: '/images/clients/walk-through-my-lens.png',
    accent: SAFFRON,
    icon: Camera,
    blurb:
      'Personalised video editing for a travel creator — story-led edits that bring journeys to life.',
    services: ['Video Editing', 'Content'],
  },
  {
    slug: 'wisdom-of-mind',
    name: 'Wisdom of Mind',
    industry: 'Vedic & Wellness',
    location: 'Haryana',
    logo: '/images/clients/wisdom-of-mind.png',
    accent: VIOLET,
    icon: BookOpen,
    blurb:
      'Multiple video shoots plus article generation — making Vedic knowledge and psychology content more engaging.',
    services: ['Video Production', 'Content', 'Articles'],
  },
  {
    slug: 'save-time',
    name: 'Save Time',
    industry: 'Construction Materials',
    location: 'United Kingdom',
    logo: '/images/clients/save-time.png',
    accent: SAFFRON,
    icon: Truck,
    blurb:
      'Full search visibility for a UK concrete-mix supplier — SEO, answer-engine (AEO) and generative-engine (GEO) optimization to win Google rankings, featured answers and citations in AI search.',
    services: ['SEO', 'AEO', 'GEO'],
  },
  {
    slug: 'quick-concrete',
    name: 'Quick Concrete',
    industry: 'Construction Materials',
    location: 'United Kingdom',
    logo: '/images/clients/quick-concrete.png',
    accent: VIOLET,
    icon: HardHat,
    blurb:
      'SEO, AEO and GEO for a UK construction-materials supplier — ranking on Google, owning the featured answers, and getting cited by AI search engines.',
    services: ['SEO', 'AEO', 'GEO'],
  },
  {
    slug: 'gaba-jewellers',
    name: 'Gaba Jewellers',
    industry: 'Jewellery',
    location: 'London, UK',
    logo: '/images/clients/gaba-jewellers.png',
    accent: SAFFRON,
    icon: Gem,
    blurb:
      'Review and reputation campaigns to lift the Google rating for a London jeweller — building authentic, policy-compliant review volume that strengthens local rank and buyer trust.',
    services: ['Review Campaigns', 'Reputation Management'],
  },
]

/** Distinct industries we have shipped in, for trust strips. */
export const clientIndustries = Array.from(
  new Set(clients.map((c) => c.industry))
)
