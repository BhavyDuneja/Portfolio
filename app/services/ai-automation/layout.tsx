import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Automation & Intelligence — Voice Agents from ₹6/min',
  description: 'AI-powered voice calling agents at ₹6/min, recruiter AI at ₹2/lead, social media automation, Gmail automation, AI video generators, and marketing tools by AnantaSutra.',
  alternates: {
    canonical: 'https://anantasutra.com/services/ai-automation',
  },
  openGraph: {
    title: 'AI Automation & Intelligence — AnantaSutra',
    description: 'Voice calling agents at ₹6/min, recruiter AI at ₹2/lead, and a full suite of AI-powered automation tools for your business.',
    url: 'https://anantasutra.com/services/ai-automation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation & Intelligence — AnantaSutra',
    description: 'Voice calling agents at ₹6/min, recruiter AI at ₹2/lead, and a full suite of AI-powered automation tools.',
  },
}

const aiServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Automation & Intelligence',
  description: 'AI-powered voice calling agents, recruiter AI, social media automation, Gmail automation, AI video generators, and marketing tools.',
  provider: {
    '@type': 'Organization',
    name: 'AnantaSutra',
    url: 'https://anantasutra.com',
  },
  url: 'https://anantasutra.com/services/ai-automation',
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI Automation Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Voice Calling Agents',
          description: 'AI-powered voice agents for inbound and outbound calls across any domain.',
        },
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '6',
          priceCurrency: 'INR',
          unitText: 'per minute',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Recruiter AI',
          description: 'AI-powered recruitment tool that finds, qualifies, and connects candidates.',
        },
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '2',
          priceCurrency: 'INR',
          unitText: 'per lead',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Social Media Automation',
          description: 'AI-driven content scheduling, engagement, and growth across all platforms.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Video Generators',
          description: 'Professional AI-generated videos for real estate, products, and marketing.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Gmail Automation',
          description: 'Smart email workflows for responses, follow-ups, and lead nurturing.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Marketing Tools',
          description: 'Data-driven marketing automation tools for campaign optimization.',
        },
      },
    ],
  },
}

export default function AIAutomationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={aiServiceJsonLd} />
      {children}
    </>
  )
}
