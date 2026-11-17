import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Thoughts & Insights on AI, Wisdom & Marketing',
  description: 'Read articles on AI automation, ancient wisdom, marketing strategies, product stories, and the entrepreneurial journey from AnantaSutra.',
  // One canonical for every hub view: /blog?tag=…, /blog?category=… and /blog?q=… render this same static page
  // (BlogList applies the filter in the browser); the canonical alone tells Google they are the same page.
  alternates: {
    canonical: 'https://www.anantasutra.com/blog',
  },
  openGraph: {
    title: 'AnantaSutra Blog — Thoughts & Insights',
    description: 'AI automation, ancient wisdom, marketing strategies, product stories, and the entrepreneurial journey.',
    url: 'https://www.anantasutra.com/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnantaSutra Blog — Thoughts & Insights',
    description: 'AI automation, ancient wisdom, marketing strategies, product stories, and the entrepreneurial journey.',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
