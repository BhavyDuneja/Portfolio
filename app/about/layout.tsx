import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us — The Story of Infinite Wisdom',
  description: 'AnantaSutra (अनन्तसूत्र) is an infinite thread weaving together technology, creativity, wisdom, and human potential into a tapestry of purposeful ventures.',
  alternates: {
    canonical: 'https://anantasutra.com/about',
  },
  openGraph: {
    title: 'About AnantaSutra — The Story of Infinite Wisdom',
    description: 'AnantaSutra is more than a company. It is an infinite thread weaving together technology, creativity, wisdom, and human potential.',
    url: 'https://anantasutra.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About AnantaSutra — The Story of Infinite Wisdom',
    description: 'AnantaSutra is more than a company. It is an infinite thread weaving together technology, creativity, wisdom, and human potential.',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
