'use client'

import { useState } from 'react'
import { clients, type Client } from '@/lib/clients'

const BrandLogo = ({ client }: { client: Client }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = client.icon

  return (
    <div className="brand-marquee-item group">
      <div className="bg-white rounded-2xl shadow-lg shadow-black/30 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-105">
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={client.logo}
            alt={`${client.name} logo`}
            className="max-w-full max-h-full object-contain"
            onError={() => setImgFailed(true)}
            loading="lazy"
          />
        ) : (
          <Icon className="w-10 h-10" style={{ color: client.accent }} />
        )}
      </div>
      <span className="mt-3 block text-center text-xs text-gray-400 group-hover:text-white transition-colors">
        {client.name}
      </span>
    </div>
  )
}

const BrandMarquee = () => {
  // Duplicate the list so the -50% translate loops seamlessly
  const track = [...clients, ...clients]

  return (
    <div className="relative w-full">
      <p className="text-center text-xs sm:text-sm text-gray-400 uppercase tracking-widest mb-8">
        Brands we&apos;ve already worked with
      </p>

      <div className="brand-marquee">
        <div className="brand-marquee-track">
          {track.map((client, idx) => (
            <BrandLogo key={`${client.slug}-${idx}`} client={client} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BrandMarquee
