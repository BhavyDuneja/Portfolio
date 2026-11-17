import JsonLd from '@/components/JsonLd'
import { pageMetadata, PAGE_SEO } from '@/lib/seo'

// Applies to the /services hub only: every service sub-route has its own layout with a
// self-referencing canonical, so none of them inherits this one.
export const metadata = pageMetadata(PAGE_SEO.services)

const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AnantaSutra Services',
  description: 'Dedicated experts embedded in your team and AI solutions that work 24/7, by AnantaSutra.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'Dedicated Experts',
        description: 'Vetted domain experts embedded in your team in about 7 days. Pay their salary plus one transparent fee, with no agency markup and a 48-hour replacement guarantee.',
        provider: { '@type': 'Organization', name: 'AnantaSutra' },
        url: 'https://www.anantasutra.com/services/dedicated-experts',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'Service',
        name: 'AI Solutions',
        description: 'AI that takes over a job and runs it around the clock: voice calling agents, recruiter AI, social media and Gmail automation, AI video generators and marketing tools.',
        provider: { '@type': 'Organization', name: 'AnantaSutra' },
        url: 'https://www.anantasutra.com/services/ai-automation',
        offers: [
          {
            '@type': 'Offer',
            name: 'Voice Calling Agents',
            description: 'Intelligent conversational AI that handles calls with human-like natural language understanding',
            price: '6',
            priceCurrency: 'INR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '6',
              priceCurrency: 'INR',
              unitText: 'minute',
            },
          },
          {
            '@type': 'Offer',
            name: 'Recruiter AI',
            description: 'Automated talent sourcing with boolean search generation and personalized outreach',
            price: '2',
            priceCurrency: 'INR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '2',
              priceCurrency: 'INR',
              unitText: 'lead',
            },
          },
        ],
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        name: 'Creative & Marketing Agency',
        description: 'End-to-end marketing support from shooting to social media management. We amplify your brand across every channel.',
        provider: { '@type': 'Organization', name: 'AnantaSutra' },
        url: 'https://www.anantasutra.com/services/marketing',
      },
    },
    {
      '@type': 'ListItem',
      position: 4,
      item: {
        '@type': 'Service',
        name: 'Website Building & Search Optimization (SEO, AEO, GEO)',
        description: 'We build high-performance websites and optimize them for Google (SEO), AI assistants like ChatGPT and Perplexity (AEO — Answer Engine Optimization), and generative AI platforms (GEO — Generative Engine Optimization).',
        provider: { '@type': 'Organization', name: 'AnantaSutra' },
        url: 'https://www.anantasutra.com/services',
        serviceType: ['Website Development', 'SEO', 'AEO', 'GEO'],
      },
    },
  ],
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={servicesJsonLd} />
      {children}
    </>
  )
}
