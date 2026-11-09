// Anantasutra pay-per-use tools, shown on /apps and in its JSON-LD.
// Prices and links match the live listings (Apify Store user "motivating_bracelet", Setu on Cloudflare Workers).

export type ToolStatus = 'live' | 'coming-soon'

export interface Tool {
  id: string
  name: string
  sanskrit: string
  tagline: string
  description: string
  features: string[]
  status: ToolStatus
  platform: string
  /** Short price shown on the card, e.g. "$0.004 per URL". */
  price: string
  /** Lowest per-use price in USD, for structured data. Omitted when the tool is not on sale yet. */
  priceUsd?: string
  priceUnit?: string
  url?: string
  cta: string
  logo: string
}

export const tools: Tool[] = [
  {
    id: 'drishti',
    name: 'Drishti',
    sanskrit: 'दृष्टि',
    tagline: 'Can AI search see your website?',
    description:
      'Checks whether ChatGPT, Claude, Perplexity, Google AI Overviews and 25+ AI crawlers can reach and read your site, then gives a 0–100 GEO score with the fixes that matter most.',
    features: ['AI crawler access from robots.txt (RFC 9309)', 'llms.txt and structured data checks', '0–100 GEO score with fixes'],
    status: 'live',
    platform: 'Apify Store',
    price: '$0.004 per URL',
    priceUsd: '0.004',
    priceUnit: 'URL audited',
    url: 'https://apify.com/motivating_bracelet/drishti-anantasutra',
    cta: 'Run on Apify',
    logo: '/images/tools/drishti.webp',
  },
  {
    id: 'suchi',
    name: 'Suchi',
    sanskrit: 'सूची',
    tagline: 'llms.txt for any website',
    description:
      'Generates a spec-compliant llms.txt and llms-full.txt for any site, so AI assistants can understand your content and cite it correctly.',
    features: ['Respects robots.txt, sitemap first', 'Clean Markdown for every page', 'Pay per page, no subscription'],
    status: 'live',
    platform: 'Apify Store',
    price: '$0.001 per page',
    priceUsd: '0.001',
    priceUnit: 'page processed',
    url: 'https://apify.com/motivating_bracelet/suchi-anantasutra',
    cta: 'Run on Apify',
    logo: '/images/tools/suchi.webp',
  },
  {
    id: 'pramana',
    name: 'Pramana',
    sanskrit: 'प्रमाण',
    tagline: 'Validate Indian business IDs in bulk',
    description:
      'Detects and validates GSTIN, PAN, TAN, CIN, LLPIN, IFSC, PIN codes, UPI IDs and vehicle numbers, and decodes what each one contains.',
    features: ['GSTIN checksum and state decoding', 'IFSC branch and PIN post office lookup', 'Runs offline: fast and private'],
    status: 'live',
    platform: 'Apify Store',
    price: '$0.40 per 1,000 IDs',
    priceUsd: '0.0004',
    priceUnit: 'identifier validated',
    url: 'https://apify.com/motivating_bracelet/pramana-anantasutra',
    cta: 'Run on Apify',
    logo: '/images/tools/pramana.webp',
  },
  {
    id: 'sthana',
    name: 'Sthana',
    sanskrit: 'स्थान',
    tagline: 'Clean up messy Indian addresses',
    description:
      'Splits free-text Indian addresses into house, street, locality, city, district, state and PIN, checks the PIN against India Post data and scores its confidence.',
    features: ['PIN checked against state and district', 'Fixes city aliases and old names', 'Confidence score on every address'],
    status: 'live',
    platform: 'Apify Store',
    price: '$0.80 per 1,000 addresses',
    priceUsd: '0.0008',
    priceUnit: 'address normalized',
    url: 'https://apify.com/motivating_bracelet/sthana-anantasutra',
    cta: 'Run on Apify',
    logo: '/images/tools/sthana.webp',
  },
  {
    id: 'setu',
    name: 'Setu',
    sanskrit: 'सेतु',
    tagline: 'Our tools as one API for AI agents',
    description:
      'A pay-per-call JSON API with Indian ID validation, AI visibility audits, AI crawler matrices and llms.txt checks. AI agents pay for each call automatically with x402.',
    features: ['No signup: pay per call in USDC on Base', 'Five endpoints with an OpenAPI spec', 'Built for AI agents and developers'],
    status: 'live',
    platform: 'API',
    price: 'From $0.005 per call',
    priceUsd: '0.005',
    priceUnit: 'API call',
    url: 'https://setu.xyz23110928.workers.dev',
    cta: 'View API',
    logo: '/images/tools/setu.webp',
  },
  {
    id: 'netra',
    name: 'Netra',
    sanskrit: 'नेत्र',
    tagline: 'AI visibility, one click away',
    description:
      'A Chrome and Edge extension that scores any page you open for AI search: crawler access, meta robots, llms.txt, JSON-LD and what is visible without JavaScript.',
    features: ['Free 0–100 score for any page', 'Pro: bulk audits and CSV export', 'Pro: history and competitor comparison'],
    status: 'coming-soon',
    platform: 'Chrome & Edge',
    price: 'Free, with a Pro plan',
    cta: 'Get notified',
    logo: '/images/tools/netra.webp',
  },
]
