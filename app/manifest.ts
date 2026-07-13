import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AnantaSutra — Infinite Wisdom, Applied',
    short_name: 'AnantaSutra',
    description: 'Dedicated domain experts embedded in your team — you pay just the salary, no agency markup.',
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
