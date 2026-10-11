import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { isIndexableBlogPost } from '@/lib/blogIndexable'

export const revalidate = 3600 // regenerate every hour

async function getBlogPosts() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return []

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, date')
      .or(`status.eq.published,and(status.eq.scheduled,scheduled_date.lte.${new Date().toISOString()})`)

    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.anantasutra.com'

  // No lastModified on static routes: a build-time date carries no signal. The five placeholder
  // service pages (ecommerce, real-estate, immigration, business, academic) are noindex until built.
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/ai-automation`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/marketing`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/voice-agents`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/video-generators`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/social-automation`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/gmail-automation`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/ai-marketing`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/recruiter-ai`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/content-shooting`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/social-media`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/services/dedicated-experts`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/testimonials`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/apps`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/co-founder`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const blogPosts = (await getBlogPosts()).filter((post) => isIndexableBlogPost(post.slug, post.date))
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
