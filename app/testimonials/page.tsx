'use client'

import { useEffect } from 'react'
import TestimonialsHero from '@/components/anantasutra/TestimonialsHero'
import Projects from '@/components/anantasutra/Projects'
import ClientTestimonials from '@/components/anantasutra/ClientTestimonials'
import Stats from '@/components/anantasutra/Stats'
import CTA from '@/components/anantasutra/CTA'

export default function TestimonialsPage() {
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
      <TestimonialsHero />
      <Projects />
      <ClientTestimonials />
      <Stats />
      <CTA />
    </div>
  )
}
