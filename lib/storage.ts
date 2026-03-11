// Storage utility for blog posts — Supabase backend
import { supabase, DbBlogPost } from './supabase'

export type PostStatus = 'draft' | 'published' | 'scheduled'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
  status: PostStatus
  scheduledDate?: string
  viewCount: number
  metaTitle?: string
  metaDescription?: string
  thumbnailUrl?: string
  fullImageUrl?: string
  imageAlt?: string
  imageUrl?: string
  videoUrl?: string
  createdAt: string
  updatedAt: string
}

// Generate a URL-friendly slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

// ---------------------------------------------------------------------------
// Mapping helpers between DB (snake_case) and frontend (camelCase)
// ---------------------------------------------------------------------------

const dbToPost = (row: DbBlogPost): BlogPost => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  author: row.author_name,
  date: row.date,
  readTime: row.read_time,
  category: row.category,
  tags: row.tags ?? [],
  featured: row.featured,
  status: row.status,
  scheduledDate: row.scheduled_date ?? undefined,
  viewCount: row.view_count,
  metaTitle: row.meta_title ?? undefined,
  metaDescription: row.meta_description ?? undefined,
  imageAlt: row.image_alt ?? undefined,
  imageUrl: row.image_url ?? undefined,
  videoUrl: row.video_url ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const postToDb = (
  post: Partial<BlogPost> & { id?: string },
): Record<string, unknown> => {
  const map: Record<string, unknown> = {}

  if (post.id !== undefined) map.id = post.id
  if (post.title !== undefined) map.title = post.title
  if (post.slug !== undefined) map.slug = post.slug
  if (post.excerpt !== undefined) map.excerpt = post.excerpt
  if (post.content !== undefined) map.content = post.content
  if (post.author !== undefined) map.author_name = post.author
  if (post.date !== undefined) map.date = post.date
  if (post.readTime !== undefined) map.read_time = post.readTime
  if (post.category !== undefined) map.category = post.category
  if (post.tags !== undefined) map.tags = post.tags
  if (post.featured !== undefined) map.featured = post.featured
  if (post.status !== undefined) map.status = post.status
  if (post.scheduledDate !== undefined) map.scheduled_date = post.scheduledDate
  if (post.viewCount !== undefined) map.view_count = post.viewCount
  if (post.metaTitle !== undefined) map.meta_title = post.metaTitle
  if (post.metaDescription !== undefined) map.meta_description = post.metaDescription
  if (post.imageUrl !== undefined) map.image_url = post.imageUrl
  if (post.imageAlt !== undefined) map.image_alt = post.imageAlt
  if (post.videoUrl !== undefined) map.video_url = post.videoUrl

  return map
}

// ---------------------------------------------------------------------------
// Slug-based ID generation (matches previous behaviour)
// ---------------------------------------------------------------------------

const generateId = async (title: string): Promise<string> => {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', slug)
      .maybeSingle()

    if (!data) break
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// ---------------------------------------------------------------------------
// CRUD operations — all async, all hit Supabase
// ---------------------------------------------------------------------------

/** Get every post (all statuses) — for admin dashboard */
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all posts:', error)
    return []
  }

  return (data as DbBlogPost[]).map(dbToPost)
}

/** Get published posts (+ scheduled posts whose date has passed) */
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_date.lte.${now})`)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching published posts:', error)
    return []
  }

  return (data as DbBlogPost[]).map(dbToPost)
}

/** Get a single post by its ID or slug */
export const getPostById = async (idOrSlug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .maybeSingle()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data ? dbToPost(data as DbBlogPost) : null
}

/** Create a new post */
export const addPost = async (
  post: Omit<BlogPost, 'id'>,
  authorId?: string,
): Promise<BlogPost> => {
  const id = await generateId(post.title)

  const dbRow: Record<string, unknown> = {
    ...postToDb({ ...post, id }),
    slug: post.slug || generateSlug(post.title),
  }

  if (authorId) {
    dbRow.author_id = authorId
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(dbRow)
    .select()
    .single()

  if (error) {
    console.error('Error adding post:', error)
    throw new Error(`Failed to add post: ${error.message}`)
  }

  return dbToPost(data as DbBlogPost)
}

/** Update an existing post */
export const updatePost = async (
  id: string,
  updates: Partial<BlogPost>,
): Promise<BlogPost | null> => {
  const dbUpdates = postToDb(updates)
  // updated_at is handled by the DB trigger, but we can set it explicitly too
  dbUpdates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('blog_posts')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    return null
  }

  return dbToPost(data as DbBlogPost)
}

/** Delete a post by ID */
export const deletePost = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    return false
  }

  return true
}

/** Increment the view counter for a post */
export const incrementViewCount = async (id: string): Promise<void> => {
  // Use rpc if available, otherwise read-then-write
  const { data: post } = await supabase
    .from('blog_posts')
    .select('view_count')
    .or(`id.eq.${id},slug.eq.${id}`)
    .maybeSingle()

  if (!post) return

  const newCount = (post.view_count ?? 0) + 1

  await supabase
    .from('blog_posts')
    .update({ view_count: newCount })
    .or(`id.eq.${id},slug.eq.${id}`)
}

/** Full-text / ilike search across title, excerpt, content, and tags */
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  const pattern = `%${query}%`

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(
      `title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`,
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching posts:', error)
    return []
  }

  return (data as DbBlogPost[]).map(dbToPost)
}

/** Get related posts (same category, excluding the given post) */
export const getRelatedPosts = async (
  postId: string,
  limit: number = 3,
): Promise<BlogPost[]> => {
  // First fetch the current post to know its category
  const current = await getPostById(postId)
  if (!current) return []

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .neq('id', current.id)
    .eq('category', current.category)
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_date.lte.${now})`)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return (data as DbBlogPost[]).map(dbToPost)
}

/** Get featured published posts */
export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('featured', true)
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_date.lte.${now})`)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }

  return (data as DbBlogPost[]).map(dbToPost)
}

/** Get distinct categories (prefixed with "All") */
export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')

  if (error) {
    console.error('Error fetching categories:', error)
    return ['All']
  }

  const unique = Array.from(new Set((data as { category: string }[]).map(r => r.category)))
  return ['All', ...unique.sort()]
}

/** Aggregate stats for the admin dashboard */
export const getPostStats = async (): Promise<{
  total: number
  published: number
  drafts: number
  scheduled: number
  totalViews: number
}> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('status, view_count')

  if (error) {
    console.error('Error fetching post stats:', error)
    return { total: 0, published: 0, drafts: 0, scheduled: 0, totalViews: 0 }
  }

  const rows = data as { status: string; view_count: number }[]

  return {
    total: rows.length,
    published: rows.filter(r => r.status === 'published').length,
    drafts: rows.filter(r => r.status === 'draft').length,
    scheduled: rows.filter(r => r.status === 'scheduled').length,
    totalViews: rows.reduce((sum, r) => sum + (r.view_count ?? 0), 0),
  }
}

// ---------------------------------------------------------------------------
// Image upload (unchanged — delegates to the existing API route)
// ---------------------------------------------------------------------------

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload-image', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.success) return data.url
    console.error('Upload failed:', data.error)
    return null
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}
