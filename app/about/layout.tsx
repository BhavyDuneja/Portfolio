import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — The Story of Infinite Wisdom',
  description: 'AnantaSutra is a Delhi company that places vetted, dedicated remote experts inside client teams at one fixed monthly price. Who we are and why we started.',
  alternates: {
    canonical: 'https://www.anantasutra.com/about',
  },
  openGraph: {
    title: 'About AnantaSutra — The Story of Infinite Wisdom',
    description: 'AnantaSutra is a Delhi company that places vetted, dedicated remote experts inside client teams at one fixed monthly price. Who we are and why we started.',
    url: 'https://www.anantasutra.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About AnantaSutra — The Story of Infinite Wisdom',
    description: 'AnantaSutra is a Delhi company that places vetted, dedicated remote experts inside client teams at one fixed monthly price. Who we are and why we started.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
