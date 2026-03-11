import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact Us — Get in Touch with AnantaSutra',
  description: 'Contact AnantaSutra for AI automation, marketing services, or custom solutions. We respond within 24 hours. Free consultation available.',
  alternates: {
    canonical: 'https://anantasutra.com/contact',
  },
  openGraph: {
    title: 'Contact AnantaSutra — Let\'s Connect',
    description: 'Get in touch for AI automation, marketing services, or custom solutions. Free consultation available.',
    url: 'https://anantasutra.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact AnantaSutra — Let\'s Connect',
    description: 'Get in touch for AI automation, marketing services, or custom solutions. Free consultation available.',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do voice calling agents cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI voice calling agents start at just ₹6 per minute. The exact pricing depends on your volume, complexity, and integration requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Recruiter AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our Recruiter AI helps you find job opportunities or candidates at ₹2 per lead. It uses AI to generate boolean searches, find contacts, and draft personalized outreach.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you handle everything for marketing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Our marketing agency provides end-to-end support — from professional shooting and content creation to social media management and performance marketing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are Ritualist and Granthas free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ritualist is completely free. Granthas will have a free tier with core scriptures, and a premium tier for advanced features and commentaries.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get a custom AI solution?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. We build custom AI automation solutions tailored to your business needs. Contact us to discuss your requirements.',
      },
    },
  ],
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  )
}
