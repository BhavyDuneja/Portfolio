// Reads the daily SEO / AEO / GEO log from Supabase.
// The local daily SEO pipeline (temp/seo-pipeline) pushes one summary row per day
// into the `seo_daily` table; this surfaces it live in the admin panel.
import { supabase } from './supabase'

export interface SeoDaily {
  id: string
  day: string            // YYYY-MM-DD
  target: string | null
  article_title: string | null
  article_content: string | null   // markdown/html of the day's article
  meta_description: string | null
  audit_text: string | null
  serp_text: string | null
  geo_text: string | null
  article_link: string | null
  created_at: string
}

export const getSeoDaily = async (limit = 60): Promise<SeoDaily[]> => {
  const { data, error } = await supabase
    .from('seo_daily')
    .select('*')
    .order('day', { ascending: false })
    .limit(limit)
  if (error) { console.error('getSeoDaily:', error.message); return [] }
  return (data || []) as SeoDaily[]
}
