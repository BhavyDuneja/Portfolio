import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Services — AI Automation, Marketing, Website Building & SEO/AEO/GEO',
  description: 'AnantaSutra services: AI voice agents from ₹6/min, recruiter AI at ₹2/lead, website development, SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and full-service marketing.',
  alternates: {
    canonical: 'https://anantasutra.com/services',
  },
  openGraph: {
    title: 'AnantaSutra Services — AI Automation, Marketing & More',
    description: 'AI voice agents, recruiter AI, social media automation, professional shooting, content creation, and performance marketing.',
    url: 'https://anantasutra.com/services',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnantaSutra Services — AI Automation, Marketing & More',
    description: 'AI voice agents, recruiter AI, social media automation, professional shooting, content creation, and performance marketing.',
  },
}

const servicesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AnantaSutra Services',
  description: 'AI automation, marketing, and technology services by AnantaSutra.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'Service',
        name: 'AI Automation & Intelligence',
        description: 'Transform your business with AI-powered solutions — voice calling agents, recruiter AI, social media automation, and more.',
        provider: { '@type': 'Organization', name: 'AnantaSutra' },
        url: 'https://anantasutra.com/services/ai-automation',
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
      position: 2,
      item: {
        '@type': 'Service',
        name: 'Creative & Marketing Agency',
        description: 'End-to-end marketing support from shooting to social media management. We amplify your brand across every channel.',
        provider: { '@type': 'Organization', name: 'AnantaSutra' },
        url: 'https://anantasutra.com/services/marketing',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'Service',
        name: 'Website Building & Search Optimization (SEO, AEO, GEO)',
        description: 'We build high-performance websites and optimize them for Google (SEO), AI assistants like ChatGPT and Perplexity (AEO — Answer Engine Optimization), and generative AI platforms (GEO — Generative Engine Optimization).',
        provider: { '@type': 'Organization', name: 'AnantaSutra' },
        url: 'https://anantasutra.com/services',
        serviceType: ['Website Development', 'SEO', 'AEO', 'GEO'],
      },
    },
  ],
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Get Started with AnantaSutra AI Automation',
  description: 'Start using AI voice agents and automation tools for your business in three simple steps.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Contact Us',
      text: 'Reach out via our contact form or email at contact@anantasutra.com to discuss your business needs.',
      url: 'https://anantasutra.com/contact',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose Your Solution',
      text: 'Select from our AI automation tools — voice calling agents, recruiter AI, social media automation, or a custom solution tailored to your needs.',
      url: 'https://anantasutra.com/services/ai-automation',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Launch & Scale',
      text: 'We set up, integrate, and optimize your AI solution. Start seeing results immediately with pay-as-you-go pricing from ₹6/min.',
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
      <JsonLd data={howToJsonLd} />
      {children}
    </>
  )
}
