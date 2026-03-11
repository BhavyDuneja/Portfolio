import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Bhavya Duneja — Co-founder Portfolio',
  description: 'Bhavya Duneja is the co-founder of AnantaSutra — a technologist and visionary bridging AI, marketing, spirituality, and business. Based in Delhi, India.',
  alternates: {
    canonical: 'https://anantasutra.com/co-founder',
  },
  openGraph: {
    title: 'Bhavya Duneja — Co-founder, AnantaSutra',
    description: 'A technologist and visionary bridging AI, marketing, spirituality, and business. Co-founder of AnantaSutra.',
    url: 'https://anantasutra.com/co-founder',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhavya Duneja — Co-founder, AnantaSutra',
    description: 'A technologist and visionary bridging AI, marketing, spirituality, and business.',
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bhavya Duneja',
  jobTitle: 'Co-founder',
  url: 'https://anantasutra.com/co-founder',
  worksFor: {
    '@type': 'Organization',
    name: 'AnantaSutra',
    url: 'https://anantasutra.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Delhi',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.linkedin.com/in/bhavy-duneja',
    'https://github.com/bhavyaduneja',
  ],
  email: 'co-founder@anantasutra.com',
  knowsAbout: [
    'Artificial Intelligence',
    'Marketing',
    'Software Engineering',
    'Entrepreneurship',
    'Spirituality',
  ],
}

export default function CoFounderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={personJsonLd} />
      {children}
    </>
  )
}
