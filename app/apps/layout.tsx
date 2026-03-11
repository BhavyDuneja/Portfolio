import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Apps — Granthas & Ritualist for Mindful Living',
  description: 'Discover AnantaSutra apps: Granthas — all Hindu scriptures in one place, and Ritualist — your free daily companion for mindful living and habit tracking.',
  alternates: {
    canonical: 'https://anantasutra.com/apps',
  },
  openGraph: {
    title: 'AnantaSutra Apps — Granthas & Ritualist',
    description: 'Granthas: all Hindu scriptures in one digital library. Ritualist: free daily ritual and habit tracker for mindful living.',
    url: 'https://anantasutra.com/apps',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnantaSutra Apps — Granthas & Ritualist',
    description: 'Granthas: all Hindu scriptures in one digital library. Ritualist: free daily ritual and habit tracker for mindful living.',
  },
}

const appsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AnantaSutra Apps',
  description: 'Apps for mindful living by AnantaSutra.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Granthas',
        description: 'A comprehensive digital library of Hindu scriptures — Vedas, Upanishads, Puranas, Bhagavad Gita, and more.',
        applicationCategory: 'ReferenceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Ritualist',
        description: 'A free app for building and maintaining daily rituals, habits, and mindful practices.',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        url: 'https://ritualist.anantasutra.com',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
    },
  ],
}

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={appsJsonLd} />
      {children}
    </>
  )
}
