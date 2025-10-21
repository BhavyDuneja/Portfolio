'use client'

import { useEffect } from 'react'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Achievements from '@/components/Achievements'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'

export default function CoFounderPage() {
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
      <Experience />
      <Projects />
      <Skills />
      <Achievements />
      <Testimonials />
      <Contact />
    </div>
  )
}