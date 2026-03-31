'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { GraduationCap, ArrowRight, Bell, Sparkles } from 'lucide-react'

export default function AcademicPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf) }
        requestAnimationFrame(raf)
      })
    }
  }, [])

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-saffron-500/50 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Coming Soon
          </motion.div>

          <GraduationCap className="w-16 h-16 text-saffron-500/40 mx-auto mb-6" />

          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Academic Solutions
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            AI-powered academic support — university applications, SOP writing, scholarship guidance, upskilling programs, and career counseling for students navigating higher education in India and abroad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              <Bell className="w-4 h-4" />
              <span>Notify Me When Live</span>
            </Link>
            <Link href="/services" className="btn-outline">
              <span>Explore Other Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
