'use client'

import { useEffect } from 'react'
import PortfolioHero from '@/components/anantasutra/PortfolioHero'
import Portfolio from '@/components/anantasutra/Portfolio'
import CaseStudiesDetailed from '@/components/anantasutra/CaseStudiesDetailed'
import JsonLd from '@/components/JsonLd'

const portfolioJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'AnantaSutra Portfolio — Real Clients, Real Results',
  url: 'https://anantasutra.com/portfolio',
  description:
    'Real client work from AnantaSutra — Awish Clinic, Education Aspire, and a network of real estate agents. Case studies with challenge, approach, and measurable results.',
}

export default function PortfolioPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
      })
    }
  }, [])

  return (
    <div className="min-h-screen">
      <JsonLd data={portfolioJsonLd} />
      <PortfolioHero />
      <Portfolio />
      <CaseStudiesDetailed />
    </div>
  )
}
