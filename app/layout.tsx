import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ParticleBackground from '@/components/ParticleBackground'
import CustomCursor from '@/components/CustomCursor'
import JsonLd from '@/components/JsonLd'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import MicrosoftClarity from '@/components/MicrosoftClarity'
import FacebookPixel from '@/components/FacebookPixel'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
    { media: '(prefers-color-scheme: light)', color: '#E8A317' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://anantasutra.com'),
  title: {
    default: 'AnantaSutra — Infinite Wisdom, Applied | AI Automation, Marketing & Beyond',
    template: '%s | AnantaSutra',
  },
  description: 'AnantaSutra is a constellation of ventures spanning AI automation, marketing, technology, spirituality, and human potential. Voice agents from ₹6/min, recruiter AI at ₹2/lead.',
  keywords: 'AnantaSutra, Infinite Wisdom, AI Automation, Voice Agents, Marketing Agency, Granthas, Ritualist, Hindu Scriptures, AI Marketing Tools, Social Media Automation',
  authors: [{ name: 'AnantaSutra' }],
  creator: 'AnantaSutra',
  publisher: 'AnantaSutra',
  alternates: {
    canonical: 'https://anantasutra.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://anantasutra.com',
    title: 'AnantaSutra — Infinite Wisdom, Applied',
    description: 'A constellation of ventures spanning AI automation, marketing, technology, spirituality, and human potential.',
    siteName: 'AnantaSutra',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AnantaSutra — Infinite Wisdom, Applied',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnantaSutra — Infinite Wisdom, Applied',
    description: 'A constellation of ventures spanning AI automation, marketing, technology, spirituality, and human potential.',
    creator: '@anantasutra',
    site: '@anantasutra',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AnantaSutra',
  url: 'https://anantasutra.com',
  logo: 'https://anantasutra.com/images/logo.png',
  description: 'A constellation of ventures spanning AI automation, marketing, technology, spirituality, and human potential.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@anantasutra.com',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
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
  founder: {
    '@type': 'Person',
    name: 'Bhavya Duneja',
    jobTitle: 'Co-founder',
    url: 'https://anantasutra.com/co-founder',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/favicon-96x96.png" />
        <JsonLd data={organizationJsonLd} />
      </head>
      <body className="font-sans antialiased bg-dark-950 text-gray-100">
        <ParticleBackground />
        <CustomCursor />
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <FacebookPixel />
      </body>
    </html>
  )
}
