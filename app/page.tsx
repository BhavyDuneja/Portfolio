'use client'

import { useEffect } from 'react'
import Hero from '@/components/anantasutra/Hero'
import Services from '@/components/anantasutra/Services'
import About from '@/components/anantasutra/About'
import WhyChooseUs from '@/components/anantasutra/WhyChooseUs'

export default function AnantasutraHome() {
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
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
    </div>
  )
}