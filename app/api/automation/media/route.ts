// Short-lived hosting for Instagram reels. Instagram fetches a reel from a link, so the founder's PC asks for
// a signed upload URL, PUTs the MP4 straight to Supabase Storage (the bytes never pass through Vercel, whose
// request limit is 4.5 MB), asks for a signed download link to give Instagram, and deletes the file once the
// reel is posted. Anything left behind is deleted after 24 hours. The bucket is private.

import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
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

/** reels/<UTC yyyyMMddHHmm>-<uuid>.mp4 — the only keys these routes create, read or delete */
const REEL_KEY = /^reels\/\d{12}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.mp4$/
const BAD_PATH = 'path must be a reel key like reels/<yyyyMMddHHmm>-<uuid>.mp4'
const SIGNED_URL_SECONDS = 7200
const KEEP_MS = 24 * 60 * 60 * 1000
const MAX_BODY_BYTES = 16 * 1024

interface StorageFailure {
  message: string
  status?: number
  statusCode?: string
}

const newReelKey = (): string =>
  `reels/${new Date().toISOString().slice(0, 16).replace(/[-T:]/g, '')}-${randomUUID()}.mp4`

const isNotFound = (error: StorageFailure): boolean =>
  error.status === 404 || error.statusCode === '404' || /not found/i.test(error.message)

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

/** POST {"kind":"reel"} → a new reel key and a signed URL to PUT the MP4 to. */
export async function POST(request: NextRequest) {
  const denied = requireToken(request)
  if (denied) return denied
  const read = await readJsonBody(request, MAX_BODY_BYTES)
  if ('response' in read) return read.response
  if (read.body.kind !== 'reel') return jsonError(400, 'kind must be "reel"')
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
