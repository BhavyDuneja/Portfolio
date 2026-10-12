// Merged near-duplicate blog posts: { "old-slug": "kept-slug" }. lib/blogIndexable.ts reads the same file,
// so a redirected slug also leaves the sitemap, the blog hub and the related-post links.
const blogRedirects = require('./lib/blogRedirects.json')

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Permanent (308) redirects for merged posts, with and without the trailing slash, to the canonical URL. */
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
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
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
