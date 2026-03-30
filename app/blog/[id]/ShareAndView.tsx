'use client'

import { useEffect } from 'react'
import { Twitter, Linkedin, Share2 } from 'lucide-react'
import { incrementViewCount } from '@/lib/storage'

export default function ShareAndView({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    incrementViewCount(slug)
  }, [slug])

  const url = typeof window !== 'undefined' ? window.location.href : `https://anantasutra.com/blog/${slug}`

  return (
    <div className="pt-8 border-t border-white/10">
      <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
        <Share2 className="w-4 h-4" /> Share this article
      </h3>
      <div className="flex gap-3">
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <Twitter className="w-4 h-4" /> Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <Linkedin className="w-4 h-4" /> LinkedIn
        </a>
      </div>
    </div>
  )
}
