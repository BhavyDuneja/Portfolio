import { MetadataRoute } from 'next'

// URLs have no trailing slash (next.config.js trailingSlash: false), so every prefix is listed in both forms.
// Search engines (the "*" group) may crawl /admin: the page carries robots noindex, nofollow
// (app/admin/layout.tsx) and Google only reads a noindex on pages it is allowed to fetch. Blocking /admin
// here would freeze the stale indexed entry instead of removing it (it was indexed in Nov 2026 because only
// "/admin/" was blocked while the page answered on "/admin" with the homepage's metadata). Once Search Console
// lists /admin under "Excluded by noindex", it can join the blocked list again if wanted.
const apiOnly = ['/api', '/api/']
// AI crawlers have no index to clean up, so the admin console stays closed to them as before.
const apiAndAdmin = ['/admin', '/admin/', '/api', '/api/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: apiOnly,
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/blog', '/services', '/about', '/contact'],
        disallow: apiAndAdmin,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: apiAndAdmin,
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
        disallow: apiAndAdmin,
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: apiAndAdmin,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: apiAndAdmin,
      },
    ],
    sitemap: 'https://www.anantasutra.com/sitemap.xml',
  }
}
