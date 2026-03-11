import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DbBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author_id: string
  author_name: string
  date: string
  read_time: string
  category: string
  tags: string[]
  featured: boolean
  status: 'draft' | 'published' | 'scheduled'
  scheduled_date: string | null
  view_count: number
  meta_title: string | null
  meta_description: string | null
  image_url: string | null
  image_alt: string | null
  video_url: string | null
  created_at: string
  updated_at: string
}

export interface DbUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'writer'
  avatar_url: string | null
  created_at: string
}

export interface DbContactSubmission {
  id: string
  name: string
  email: string
  service: string | null
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}
