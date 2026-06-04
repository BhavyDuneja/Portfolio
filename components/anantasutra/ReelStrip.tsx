'use client'

import { useState } from 'react'
import { clients, type Client } from '@/lib/clients'

const FilmCard = ({ item }: { item: Client }) => {
  const [imgFailed, setImgFailed] = useState(false)
  const Icon = item.icon

  return (
    <div
      className="film-card bg-gradient-to-br"
      style={{
        backgroundImage: `linear-gradient(135deg, ${item.accent}33, ${item.accent}10 55%, #0A0A0F)`,
      }}
    >
      {/* Brand logo on a clean plate so any colour reads on the dark strip */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md shadow-black/30 w-16 h-16 flex items-center justify-center p-2">
          {!imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.logo}
              alt={item.name}
              className="max-w-full max-h-full object-contain"
              onError={() => setImgFailed(true)}
              loading="lazy"
            />
          ) : (
            <Icon className="w-7 h-7" style={{ color: item.accent }} />
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0F]/95 via-[#0A0A0F]/55 to-transparent pt-6 pb-2 px-3">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Icon className="w-3 h-3" style={{ color: item.accent }} />
          <span
            className="text-[9px] uppercase tracking-widest font-semibold"
            style={{ color: item.accent }}
          >
            {item.industry}
          </span>
        </div>
        <div className="reel-card-title text-xs font-semibold leading-tight">
          {item.name}
        </div>
      </div>
    </div>
  )
}

const ReelStrip = () => {
  const half = Math.ceil(clients.length / 2)
  const trackItemsA = [...clients.slice(0, half), ...clients.slice(0, half)]
  const trackItemsB = [...clients.slice(half), ...clients.slice(half)]

  return (
    <div className="film-reel-rotor">
      <div className="film-strip-frame">
        <div className="film-strip-track film-strip-track-a">
          {trackItemsA.map((item, idx) => (
            <FilmCard key={`a-${item.slug}-${idx}`} item={item} />
          ))}
        </div>
      </div>
      <div className="film-strip-frame">
        <div className="film-strip-track film-strip-track-b">
          {trackItemsB.map((item, idx) => (
            <FilmCard key={`b-${item.slug}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReelStrip
