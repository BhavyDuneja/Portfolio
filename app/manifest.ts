import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnantaSutra — Infinite Wisdom, Applied',
    short_name: 'AnantaSutra',
    description: 'Dedicated remote experts embedded in your team at one fixed monthly price. No extra fees, no lock-in.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0F',
    theme_color: '#E8A317',
    orientation: 'portrait-primary',
    categories: ['business', 'technology', 'lifestyle'],
    icons: [
      {
        src: '/images/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
