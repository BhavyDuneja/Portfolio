// Merged near-duplicate blog posts: { "old-slug": "kept-slug" }. lib/blogIndexable.ts reads the same file,
// so a redirected slug also leaves the sitemap, the blog hub and the related-post links.
const blogRedirects = require('./lib/blogRedirects.json')

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Permanent (308) redirects for merged posts, with and without the trailing slash, to the canonical URL.
 *  (Next's own trailing-slash redirect runs first, so /blog/<old>/ reaches the canonical in two hops; the
 *  slashed rule stays as a safety net.) */
function blogRedirectRules() {
  return Object.entries(blogRedirects).flatMap(([from, to]) => {
    if (!SLUG.test(from) || typeof to !== 'string' || !SLUG.test(to) || from === to || to in blogRedirects) {
      throw new Error(`lib/blogRedirects.json: invalid redirect "${from}" -> "${to}"`)
    }
    const destination = `/blog/${to}`
    return [
      { source: `/blog/${from}`, destination, permanent: true },
      { source: `/blog/${from}/`, destination, permanent: true },
    ]
  })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Canonical tags and the sitemap use slash-less URLs. With trailingSlash: true plus skipTrailingSlashRedirect,
  // /about and /about/ both answered 200 and Google collected impressions on both (Nov 2026); now /x/ is a 308
  // to /x, API routes included (the marketing repo's scripts/website.py calls /api/automation/<route>/ and
  // follows that 308; a 308 keeps the method and the body).
  trailingSlash: false,
  async redirects() {
    return blogRedirectRules()
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
}

module.exports = nextConfig
