import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Creative & Marketing Agency — Brands That Resonate',
  description: 'Full-service marketing agency by AnantaSutra: professional shooting, content creation, social media management, brand strategy, performance marketing, and creative direction.',
  alternates: {
    canonical: 'https://anantasutra.com/services/marketing',
  },
  openGraph: {
    title: 'Creative & Marketing Agency — AnantaSutra',
    description: 'End-to-end marketing: shooting, content creation, social media management, brand strategy, and performance marketing.',
    url: 'https://anantasutra.com/services/marketing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creative & Marketing Agency — AnantaSutra',
    description: 'End-to-end marketing: shooting, content creation, social media management, brand strategy, and performance marketing.',
  },
}

const marketingServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Creative & Marketing Agency',
  description: 'Full-service marketing agency providing professional shooting, content creation, social media management, brand strategy, performance marketing, and creative direction.',
  provider: {
    '@type': 'Organization',
    name: 'AnantaSutra',
    url: 'https://anantasutra.com',
  },
  url: 'https://anantasutra.com/services/marketing',
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Marketing Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Professional Shooting',
          description: 'High-quality photo and video production — product shoots, corporate videos, event coverage, and drone shots.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Content Creation',
          description: 'Graphic design, copywriting, brand collateral, presentations, infographics, and motion graphics.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Social Media Management',
          description: 'Platform strategy, content calendar, community management, and monthly reporting across all platforms.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Performance Marketing',
          description: 'ROI-driven paid campaigns across Google, Meta, LinkedIn with conversion optimization and reporting.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Brand Strategy',
          description: 'Market research, brand positioning, identity design, brand guidelines, and go-to-market strategy.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Creative Direction',
          description: 'Art direction, visual language development, campaign concepts, and creative consulting.',
        },
      },
    ],
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={marketingServiceJsonLd} />
      {children}
    </>
  )
}
