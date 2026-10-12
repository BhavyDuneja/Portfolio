// Publishes or updates one blog post for the marketing automation on the founder's PC.
// The automation's posts have the id "as-<slug>", so it can only ever change its own posts: a slug that
// belongs to a post written in the admin panel is refused with 409, and so is a slug or id that would make
// another post's page ambiguous.

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DbBlogPost } from '@/lib/supabase'
import {
  JsonObject,
  getServiceClient,
  jsonError,
  jsonOk,
  readJsonBody,
  requireToken,
  safeMessage,
  upstreamError,
} from '@/lib/automationApi'
import { sanitizeHtml } from '@/lib/sanitizeHtml'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_BYTES = 512 * 1024
const SITE_URL = 'https://www.anantasutra.com'
const ID_PREFIX = 'as-'
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/
const READ_TIME = /^\d{1,3} min read$/
const PLACEHOLDER = /\[ADD:/i
// "<" followed by a letter, "/", "!" or "?" starts a tag or a comment in HTML. Only content may hold markup;
// the other text fields are plain text ("in <48 hours" is still fine).
const MARKUP = /<[a-z/!?]/i
const UNIQUE_VIOLATION = '23505'

/** The columns this route writes. view_count, created_at, author_id and video_url are left to the database. */
type BlogRow = Pick<
  DbBlogPost,
  | 'id' | 'title' | 'slug' | 'excerpt' | 'content' | 'author_name' | 'date' | 'read_time' | 'category' | 'tags'
  | 'featured' | 'status' | 'scheduled_date' | 'meta_title' | 'meta_description' | 'image_url' | 'image_alt'
>

/** Reads body fields one by one and keeps the first problem it finds. Unknown fields are ignored. */
class FieldReader {
  problem: string | null = null

  constructor(private readonly body: JsonObject) {}

  fail(message: string): void {
    if (!this.problem) this.problem = message
  }

  /** Trimmed text, or null when the field is missing or empty. Only an `html` field may contain markup. */
  optional(field: string, max: number, html = false): string | null {
    const raw = this.body[field]
    if (raw === undefined || raw === null) return null
    if (typeof raw !== 'string') {
      this.fail(`${field} must be a string`)
      return null
    }
    const value = raw.trim()
    if (value.length > max) this.fail(`${field} must be at most ${max} characters`)
    else if (PLACEHOLDER.test(value)) this.fail(`${field} still has an [ADD: ...] placeholder`)
    else if (!html && MARKUP.test(value)) this.fail(`${field} must be plain text, without HTML tags`)
    return value || null
  }

  /** Trimmed text that has to be there ('' when it isn't, with the problem noted). */
  required(field: string, max: number, html = false): string {
    const value = this.optional(field, max, html)
    if (value === null) this.fail(`${field} is required`)
    return value || ''
  }

  /** At most `maxCount` tags of 1 to `maxLength` characters. */
  tags(field: string, maxCount: number, maxLength: number): string[] {
    const raw = this.body[field]
    if (raw === undefined || raw === null) return []
    if (!Array.isArray(raw)) {
      this.fail(`${field} must be a list of strings`)
      return []
    }
    if (raw.length > maxCount) this.fail(`${field} can have at most ${maxCount} entries`)
    const tags: string[] = []
    raw.forEach((tag: unknown) => {
      const value = typeof tag === 'string' ? tag.trim() : ''
      if (!value || value.length > maxLength) this.fail(`each of ${field} must be text of 1-${maxLength} characters`)
      else if (PLACEHOLDER.test(value)) this.fail(`${field} still has an [ADD: ...] placeholder`)
      else if (MARKUP.test(value)) this.fail(`${field} must be plain text, without HTML tags`)
      else tags.push(value)
    })
    return tags
  }
}

function isRealDate(value: string): boolean {
  const m = DATE.exec(value)
  if (!m) return false
  const [year, month, day] = [+m[1], +m[2], +m[3]]
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function isHttpsUrl(value: string): boolean {
  if (/[\s"'<>\\]/.test(value)) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname !== ''
  } catch {
    return false
  }
}

const readTimeOf = (html: string): string => {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function parsePost(body: JsonObject): { row: BlogRow } | { error: string } {
  const fields = new FieldReader(body)
  const slug = fields.required('slug', 100)
  if (slug && !SLUG.test(slug)) fields.fail('slug must be lowercase letters and digits joined by single hyphens')
  const title = fields.required('title', 200)
  const metaDescription = fields.required('meta_description', 320)
  const excerpt = fields.optional('excerpt', 500)
  const content = fields.required('content', 300000, true)
  const date = fields.required('date', 100)
  if (date && !isRealDate(date)) fields.fail('date must be a real date written YYYY-MM-DD')
  const readTime = fields.optional('read_time', 100)
  if (readTime && !READ_TIME.test(readTime)) fields.fail('read_time must look like "6 min read"')
  const category = fields.optional('category', 60)
  const tags = fields.tags('tags', 12, 50)
  const authorName = fields.optional('author_name', 80)
  const imageUrl = fields.optional('image_url', 500)
  if (imageUrl && !isHttpsUrl(imageUrl)) fields.fail('image_url must be an https:// URL')
  const metaTitle = fields.optional('meta_title', Infinity)
  const imageAlt = fields.optional('image_alt', Infinity)
  if (fields.problem) return { error: fields.problem }

  const html = sanitizeHtml(content).trim()
  if (!html) return { error: 'content is empty once unsafe HTML is removed' }

  return {
    row: {
      id: ID_PREFIX + slug,
      title,
      slug,
      excerpt: excerpt || metaDescription,
      content: html,
      author_name: authorName || 'AnantaSutra',
      date,
      read_time: readTime || readTimeOf(html),
      category: category || 'General',
      tags,
      featured: false,
      status: 'published',
      scheduled_date: null,
      meta_title: metaTitle,
      meta_description: metaDescription,
      image_url: imageUrl,
      image_alt: imageAlt,
    },
  }
}

type PostKey = Pick<DbBlogPost, 'id' | 'slug'>

/**
 * Why the post can't be saved, or null when no other post uses its slug or id. /blog/<x>/ opens the post
 * whose slug or id is x, so besides an equal slug or id, a slug that is another post's id (or an id that is
 * another post's slug) would give one URL to two posts. `existing` holds the posts whose slug or id is this
 * post's slug or id; the post's own earlier version is fine.
 */
function conflictWith(row: BlogRow, existing: PostKey[]): string | null {
  const others = existing.filter((post) => post.id !== row.id || post.slug !== row.slug)
  const sameSlug = others.find((post) => post.slug === row.slug)
  if (sameSlug) {
    return sameSlug.id.startsWith(ID_PREFIX)
      ? `the slug "${row.slug}" is already used by the post with id "${sameSlug.id}"`
      : `the slug "${row.slug}" belongs to a post written in the admin panel; the automation never overwrites it`
  }
  const sameId = others.find((post) => post.id === row.id)
  if (sameId) return `the id "${row.id}" already belongs to /blog/${sameId.slug}/`
  const slugIsId = others.find((post) => post.id === row.slug)
  if (slugIsId) return `/blog/${row.slug}/ already opens the post with id "${row.slug}" (/blog/${slugIsId.slug}/)`
  const idIsSlug = others.find((post) => post.slug === row.id)
  if (idIsSlug) return `the id "${row.id}" is the slug of another post (/blog/${row.id}/)`
  return null
}

/**
 * Inserts the post, or updates the automation's own earlier version of it. The write itself only touches
 * that version (an insert fails on a slug or id that exists, an update matches id "as-<slug>" together with
 * the slug), so a post saved by someone else between the check and the write is never overwritten: the
 * check runs once more and answers 409. Repeating a request is safe.
 */
async function saveRow(db: SupabaseClient, row: BlogRow): Promise<{ created: boolean } | { response: NextResponse }> {
  try {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      // The slug was validated ([a-z0-9-] only), so it and the id are safe inside the filter
      const { data, error } = await db
        .from('blog_posts')
        .select('id, slug')
        .or(`slug.eq.${row.slug},id.eq.${row.id},id.eq.${row.slug},slug.eq.${row.id}`)
      if (error) return { response: upstreamError('database error', error) }

      const existing = (data || []) as PostKey[]
      const conflict = conflictWith(row, existing)
      if (conflict) return { response: jsonError(409, conflict) }

      if (existing.length > 0) {
        const updated = await db.from('blog_posts').update(row).eq('id', row.id).eq('slug', row.slug).select('id')
        if (updated.error) return { response: upstreamError('database error', updated.error) }
        if (updated.data && updated.data.length > 0) return { created: false }
      } else {
        const inserted = await db.from('blog_posts').insert(row)
        if (!inserted.error) return { created: true }
        if (inserted.error.code !== UNIQUE_VIOLATION) return { response: upstreamError('database error', inserted.error) }
      }
      // Another post took this slug or id, or this post was changed or removed, since the check: check again
    }
    return { response: jsonError(409, 'another post with this slug or id was saved at the same moment; try again') }
  } catch (err) {
    return { response: upstreamError('database error', err) }
  }
}

export async function POST(request: NextRequest) {
  const denied = requireToken(request)
  if (denied) return denied
  const read = await readJsonBody(request, MAX_BODY_BYTES)
  if ('response' in read) return read.response
  const parsed = parsePost(read.body)
  if ('error' in parsed) return jsonError(400, parsed.error)
  const service = getServiceClient()
  if (!service.client) return jsonError(503, service.error)

  const { row } = parsed
  const saved = await saveRow(service.client, row)
  if ('response' in saved) return saved.response

  // The blog list, the post pages and the sitemap are cached; refresh them so the post shows up now
  let revalidated = true
  try {
    revalidatePath('/blog')
    revalidatePath('/blog/[id]', 'page')
    revalidatePath('/sitemap.xml')
  } catch (err) {
    revalidated = false
    console.error('[automation/blog] revalidate failed:', safeMessage(err))
  }

  console.log(`[automation/blog] ${saved.created ? 'published' : 'updated'} ${row.id}`)
  return jsonOk({
    id: row.id,
    slug: row.slug,
    url: `${SITE_URL}/blog/${row.slug}/`,
    created: saved.created,
    revalidated,
  })
}
