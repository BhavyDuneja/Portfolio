import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Services — AI Automation, Marketing & More',
  description: 'Explore AnantaSutra services: AI voice agents from ₹6/min, recruiter AI at ₹2/lead, full-service marketing agency, social media automation, and more.',
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
