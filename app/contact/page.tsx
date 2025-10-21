'use client'

import { useEffect } from 'react'
import ContactHero from '@/components/anantasutra/ContactHero'
import ContactForm from '@/components/anantasutra/ContactForm'
import ContactInfo from '@/components/anantasutra/ContactInfo'
import FAQ from '@/components/anantasutra/FAQ'
import CTA from '@/components/anantasutra/CTA'

export default function ContactPage() {
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
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <FAQ />
      <CTA />
    </div>
  )
}
