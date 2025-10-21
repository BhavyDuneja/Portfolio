'use client'

import { useEffect } from 'react'
import ServicesHero from '@/components/anantasutra/ServicesHero'
import ServicesList from '@/components/anantasutra/ServicesList'
import Process from '@/components/anantasutra/Process'
import Pricing from '@/components/anantasutra/Pricing'
import CTA from '@/components/anantasutra/CTA'

export default function ServicesPage() {
  useEffect(() => {
    // Initialize smooth scrolling
    if (typeof window !== 'undefined') {
      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 2,
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
      <ServicesHero />
      <ServicesList />
      <Process />
      <Pricing />
      <CTA />
    </div>
  )
}
