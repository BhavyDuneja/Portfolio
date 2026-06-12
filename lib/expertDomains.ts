import {
  Code2,
  Bot,
  Palette,
  Megaphone,
  Clapperboard,
  Scale,
  Stethoscope,
  Briefcase,
  Building2,
  ShoppingBag,
  Plane,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

export type ExpertDomain = {
  slug: string
  name: string
  icon: LucideIcon
  accent: string
  blurb: string
  /** Example roles a client can request inside this domain */
  roles: string[]
}

const SAFFRON = '#E8A317'
const VIOLET = '#6A3DE8'

/**
 * AnantaSutra doesn't sell fixed services — it places vetted domain experts
 * who work directly inside the client's team (in-house or remote) for any
 * duration. These are the domains a client can request an expert from.
 */
export const expertDomains: ExpertDomain[] = [
  {
    slug: 'engineering',
    name: 'Engineering & Software',
    icon: Code2,
    accent: SAFFRON,
    blurb:
      'Full-stack, backend, mobile and infrastructure engineers who ship inside your team.',
    roles: ['Full-Stack Engineer', 'Backend / API', 'DevOps & Cloud', 'Mobile Dev'],
  },
  {
    slug: 'ai-data',
    name: 'AI & Data',
    icon: Bot,
    accent: VIOLET,
    blurb:
      'ML engineers, data scientists and automation specialists to build your intelligence layer.',
    roles: ['ML Engineer', 'Data Scientist', 'Automation Specialist', 'AI Voice / Agents'],
  },
  {
    slug: 'design',
    name: 'Design & Creative',
    icon: Palette,
    accent: SAFFRON,
    blurb:
      'Product, brand and graphic designers who own the look and feel of what you build.',
    roles: ['Product Designer', 'Brand / Graphic', 'UI/UX', 'Motion Design'],
  },
  {
    slug: 'marketing',
    name: 'Marketing & Growth',
    icon: Megaphone,
    accent: VIOLET,
    blurb:
      'Performance marketers and growth leads who run your campaigns as part of your team.',
    roles: ['Performance Marketer', 'Growth Lead', 'SEO Specialist', 'Social Media'],
  },
  {
    slug: 'video-content',
    name: 'Video & Content',
    icon: Clapperboard,
    accent: SAFFRON,
    blurb:
      'Editors, shooters and content writers to keep your brand producing, consistently.',
    roles: ['Video Editor', 'Content Writer', 'Shoot Producer', 'Copywriter'],
  },
  {
    slug: 'legal',
    name: 'Legal & Compliance',
    icon: Scale,
    accent: VIOLET,
    blurb:
      'Lawyers and compliance experts for contracts, immigration matters and casework.',
    roles: ['Corporate Lawyer', 'Compliance', 'Immigration Counsel', 'Contracts'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    icon: Stethoscope,
    accent: SAFFRON,
    blurb:
      'Clinical and healthcare-ops professionals to advise, build and run your health offering.',
    roles: ['Clinical Advisor', 'Healthcare Ops', 'Telehealth', 'Medical Content'],
  },
  {
    slug: 'finance-business',
    name: 'Finance & Business',
    icon: Briefcase,
    accent: VIOLET,
    blurb:
      'Analysts, ops and strategy experts to sharpen how your business runs and grows.',
    roles: ['Business Analyst', 'Finance / FP&A', 'Operations', 'Strategy Consultant'],
  },
  {
    slug: 'property',
    name: 'Property & Real Estate',
    icon: Building2,
    accent: SAFFRON,
    blurb:
      'Real-estate specialists for listings, funnels and on-ground sales enablement.',
    roles: ['Sales Specialist', 'Funnel Expert', 'Listings Manager', 'CRM Ops'],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce & Retail',
    icon: ShoppingBag,
    accent: VIOLET,
    blurb:
      'Storefront, catalogue and retention experts to scale your online store.',
    roles: ['Store Manager', 'Catalogue Ops', 'CRO Specialist', 'Retention'],
  },
  {
    slug: 'immigration',
    name: 'Immigration & Mobility',
    icon: Plane,
    accent: SAFFRON,
    blurb:
      'Global-mobility and immigration professionals to handle complex cross-border cases.',
    roles: ['Case Manager', 'Visa Specialist', 'Documentation', 'Client Liaison'],
  },
  {
    slug: 'academic',
    name: 'Academic & Research',
    icon: GraduationCap,
    accent: VIOLET,
    blurb:
      'Researchers, subject experts and academic writers for content and programmes.',
    roles: ['Researcher', 'Subject Expert', 'Academic Writer', 'Curriculum'],
  },
]
