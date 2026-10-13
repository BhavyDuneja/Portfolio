// Media hosting for the founder's PC. The PC asks for a signed upload URL and PUTs the file straight to
// Supabase Storage, so the bytes never pass through Vercel (whose request limit is 4.5 MB).
//
// Reels ("kind":"reel"): short-lived hosting for Instagram, which fetches a reel from a link. The PC uploads
// the MP4, asks for a signed download link to give Instagram, and deletes the file once the reel is posted.
// Anything left behind is deleted after 24 hours. The bucket is private.
//
// Blog covers ("kind":"blog-cover"): the cover image of an article the automation publishes. It goes to the
// public "images" bucket, where the admin panel keeps blog images too, under blog/automation/. The post links
// to its public URL, so a cover stays for good: nothing here overwrites or deletes one.

import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  JsonObject,
  MEDIA_BUCKET,
  ensureMediaBucket,
  getServiceClient,
  jsonError,
  jsonOk,
  readJsonBody,
  requireToken,
  safeMessage,
  upstreamError,
} from '@/lib/automationApi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** reels/<UTC yyyyMMddHHmm>-<uuid>.mp4 — the reel keys POST creates, and the only keys GET and DELETE accept */
const REEL_KEY = /^reels\/\d{12}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.mp4$/
const BAD_PATH = 'path must be a reel key like reels/<yyyyMMddHHmm>-<uuid>.mp4'
const SIGNED_URL_SECONDS = 7200
const KEEP_MS = 24 * 60 * 60 * 1000
const MAX_BODY_BYTES = 16 * 1024

/** The public bucket of blog images (app/api/upload-image puts the admin panel's there). Never changed here. */
const COVER_BUCKET = 'images'
const COVER_FOLDER = 'blog/automation'
/** A post's slug as app/api/automation/blog/route.ts accepts it; a cover's name starts with it. */
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const MAX_SLUG_LENGTH = 100
const COVER_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

interface StorageFailure {
  message: string
  status?: number
  statusCode?: string
}

/** The current UTC minute as yyyyMMddHHmm, the stamp in the names of new reels and covers. */
const utcMinute = (): string => new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '')

const newReelKey = (): string => `reels/${utcMinute()}-${randomUUID()}.mp4`

const isNotFound = (error: StorageFailure): boolean =>
  error.status === 404 || error.statusCode === '404' || /not found/i.test(error.message)

const isDuplicate = (error: StorageFailure): boolean =>
  error.status === 409 || error.statusCode === '409' || /already exists|duplicate/i.test(error.message)

/** When a stored reel was created: the object's timestamp, else the UTC minute in its name. */
function createdAt(name: string, created: string | null): number {
  const stamp = created ? Date.parse(created) : NaN
  if (!isNaN(stamp)) return stamp
  const m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})-/.exec(name)
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : Date.now()
}

/** Deletes reels older than 24 hours. Best effort: a failure here never fails the request. */
async function removeOldReels(db: SupabaseClient): Promise<void> {
  try {
    const bucket = db.storage.from(MEDIA_BUCKET)
    const { data, error } = await bucket.list('reels', {
      limit: 1000,
      sortBy: { column: 'created_at', order: 'asc' },
    })
    if (error || !data) {
      if (error) console.warn('[automation/media] cleanup:', safeMessage(error))
      return
    }
    const cutoff = Date.now() - KEEP_MS
    const old = data
      .filter((file) => REEL_KEY.test(`reels/${file.name}`) && createdAt(file.name, file.created_at) < cutoff)
      .map((file) => `reels/${file.name}`)
    if (old.length === 0) return
    const removed = await bucket.remove(old)
    if (removed.error) console.warn('[automation/media] cleanup:', safeMessage(removed.error))
  } catch (err) {
    console.warn('[automation/media] cleanup:', safeMessage(err))
  }
}

/** Token, ?path= and the service client for GET and DELETE, or the answer when one of them is missing. */
function reelRequest(request: NextRequest): { path: string; db: SupabaseClient } | { response: NextResponse } {
  const denied = requireToken(request)
  if (denied) return { response: denied }
  const path = request.nextUrl.searchParams.get('path') || ''
  if (!REEL_KEY.test(path)) return { response: jsonError(400, BAD_PATH) }
  const service = getServiceClient()
  if (!service.client) return { response: jsonError(503, service.error) }
  return { path, db: service.client }
}

/** The post's slug (checked like the blog route checks it) and the file extension, or what is wrong. */
function readCoverRequest(body: JsonObject): { slug: string; extension: string } | { error: string } {
  const raw = body.slug ?? ''
  if (typeof raw !== 'string') return { error: 'slug must be a string' }
  const slug = raw.trim()
  if (!slug) return { error: 'slug is required' }
  if (slug.length > MAX_SLUG_LENGTH) return { error: `slug must be at most ${MAX_SLUG_LENGTH} characters` }
  if (!SLUG.test(slug)) return { error: 'slug must be lowercase letters and digits joined by single hyphens' }
  const extension = typeof body.content_type === 'string' ? COVER_TYPES.get(body.content_type) : undefined
  if (!extension) return { error: 'content_type must be "image/jpeg", "image/png" or "image/webp"' }
  return { slug, extension }
}

/**
 * A new cover path for the post, a signed URL to PUT the image to and the public URL the post will show.
 * The upload never replaces a file: 409 when this post already got a cover in the same minute.
 */
async function coverSlot(body: JsonObject): Promise<NextResponse> {
  const cover = readCoverRequest(body)
  if ('error' in cover) return jsonError(400, cover.error)
  const service = getServiceClient()
  if (!service.client) return jsonError(503, service.error)

  try {
    const found = await service.client.storage.getBucket(COVER_BUCKET)
    if (found.error || !found.data) return upstreamError('storage error', found.error)
    if (!found.data.public) {
      return upstreamError('storage error', `the ${COVER_BUCKET} bucket is private, so the blog could not show a cover`)
    }

    const bucket = service.client.storage.from(COVER_BUCKET)
    const path = `${COVER_FOLDER}/${cover.slug}-${utcMinute()}.${cover.extension}`
    const { data, error } = await bucket.createSignedUploadUrl(path)
    if (error && isDuplicate(error)) return jsonError(409, `${path} already exists; ask for a new cover in a minute`)
    if (error || !data) return upstreamError('storage error', error)
    return jsonOk({ path, upload_url: data.signedUrl, public_url: bucket.getPublicUrl(path).data.publicUrl })
  } catch (err) {
    return upstreamError('storage error', err)
  }
}

/**
 * POST {"kind":"reel"} → a new reel key and a signed URL to PUT the MP4 to.
 * POST {"kind":"blog-cover","slug":"<post slug>","content_type":"image/jpeg"} (or image/png, image/webp) →
 * the cover's path, a signed URL to PUT the image to and its public URL.
 */
export async function POST(request: NextRequest) {
  const denied = requireToken(request)
  if (denied) return denied
  const read = await readJsonBody(request, MAX_BODY_BYTES)
  if ('response' in read) return read.response
  if (read.body.kind === 'blog-cover') return coverSlot(read.body)
  if (read.body.kind !== 'reel') return jsonError(400, 'kind must be "reel" or "blog-cover"')
  const service = getServiceClient()
  if (!service.client) return jsonError(503, service.error)

  try {
    const bucketProblem = await ensureMediaBucket(service.client)
    if (bucketProblem) return upstreamError('storage error', bucketProblem)
    await removeOldReels(service.client)

    const path = newReelKey()
    const { data, error } = await service.client.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path)
    if (error || !data) return upstreamError('storage error', error)
    return jsonOk({ path, upload_url: data.signedUrl })
  } catch (err) {
    return upstreamError('storage error', err)
  }
}

/** GET ?path=<key> → a signed download link, valid for two hours. 404 when the reel isn't there. */
export async function GET(request: NextRequest) {
  const reel = reelRequest(request)
  if ('response' in reel) return reel.response

  try {
    const { data, error } = await reel.db.storage.from(MEDIA_BUCKET).createSignedUrl(reel.path, SIGNED_URL_SECONDS)
    if (error && isNotFound(error)) return jsonError(404, 'no reel at this path')
    if (error || !data) return upstreamError('storage error', error)
    return jsonOk({ url: data.signedUrl, expires_in: SIGNED_URL_SECONDS })
  } catch (err) {
    return upstreamError('storage error', err)
  }
}

/** DELETE ?path=<key> → removes the reel. Safe to repeat: a reel that is already gone is fine. */
export async function DELETE(request: NextRequest) {
  const reel = reelRequest(request)
  if ('response' in reel) return reel.response

  try {
    const { error } = await reel.db.storage.from(MEDIA_BUCKET).remove([reel.path])
    if (error && !isNotFound(error)) return upstreamError('storage error', error)
    return jsonOk()
  } catch (err) {
    return upstreamError('storage error', err)
  }
}
